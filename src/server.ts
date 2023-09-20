import { join } from "$std/path/join.ts";
import { extname } from "$std/path/mod.ts";
import { Litdoc, Manifest } from "litdoc/lit.ts";
import { cached } from "litdoc/utils/cached.ts";
import { hashed } from "litdoc/utils/hashed.ts";
import { logFileOperation, logText, logTime } from "litdoc/utils/log.ts";
import { memoize } from "litdoc/utils/memoize.ts";
import { modified } from "litdoc/utils/modified.ts";
import { parse } from "litdoc/utils/parse.ts";
import { Route, route } from "litdoc/utils/route.ts";
import type { Root } from "litdoc/utils/schema.ts";
import { ParseOptions, Program, swc } from "litdoc/utils/swc.ts";
import { weave, WeaveOptions } from "litdoc/utils/weave.ts";

/** HELPERS **/

async function getWeaveOptions(
  ctx: Context,
  file: string,
): Promise<WeaveOptions> {
  const { getProgram, getModule, getText } = ctx;

  const lang = extname(file).slice(1);
  const swcEnabled = true;
  if (["ts", "tsx", "js", "jsx"].includes(lang)) {
    const module = getModule(file);
    const program = swcEnabled ? await getProgram(file) : null;

    if (program) {
      const text = await getText(file);
      return {
        type: "Program",
        program,
        module,
        text,
      };
    }

    return {
      type: "Module",
      module,
    };
  }

  const text = await getText(file);
  return {
    type: "Code",
    lang,
    text,
  };
}

function createProgramCache(ctx: Context) {
  const { getConfig, getText } = ctx;
  const { cacheRoot } = getConfig();
  let parse: (source: string, options: ParseOptions) => Promise<Program>;
  return cached<Program>({
    ext: "json",
    path: join(cacheRoot, "program"),
    log: "parse program",
    parse: JSON.parse,
    stringify: (value) => JSON.stringify(value),
    load: async (file, f) => {
      const text = await getText(file);
      if (!parse) parse = await swc();
      return f(() =>
        parse(text, {
          syntax: "typescript",
          tsx: file.endsWith(".tsx"),
        })
      );
    },
  });
}

function createTemplateCache(ctx: Context) {
  const { getConfig, setValues } = ctx;
  const { cacheRoot } = getConfig();
  return cached<string>({
    ext: "md",
    log: "generate template",
    path: join(cacheRoot, "template"),
    parse: (text: string) => text,
    stringify: (text: string) => text,
    load: async (file, f) => {
      const options = await getWeaveOptions(ctx, file);
      return f(() => {
        const { text, values } = weave(options);
        setValues(file, values);
        return text;
      });
    },
  });
}

function createRootCache(ctx: Context) {
  const { getConfig, getTemplate, getValues } = ctx;
  const { cacheRoot } = getConfig();
  return cached({
    ext: "json",
    path: join(cacheRoot, "root"),
    log: "parse markdown",
    parse: JSON.parse,
    stringify: (value) => JSON.stringify(value),
    load: async (file, f) => {
      const template = await getTemplate(file);
      const values = getValues(file);
      if (!values) throw new Error(`Values not found for ${file}`);
      return f(() => {
        return parse(template);
      });
    },
  });
}

type Context = ServerContext & {
  hasModule: (file: string) => boolean;
  getConfig: () => ServerConfig;
  getValues: (file: string) => Record<string, unknown>;
  getModule: (file: string) => unknown;
  getText: (file: string) => Promise<string>;
  getHash: (file: string) => Promise<string>;
  getProgram: (file: string) => Promise<Program>;
  getTemplate: (file: string) => Promise<string>;
  getRoot: (file: string) => Promise<Root>;
  setValues: (file: string, values: Record<string, unknown>) => void;
};

/** MAIN **/

export type ServerConfig = {
  cacheRoot: string;
};

export type ServerContext = {
  route: (main: Litdoc, path: string) => Promise<Route>;
};

export function server(config: Partial<ServerConfig> = {}): ServerContext {
  let manifest: Manifest = {
    assets: {},
    routes: {},
    calls: [],
  };

  const ctx: Context = {
    getConfig: () => {
      return {
        cacheRoot: ".litdoc/cache",
        ...config,
      };
    },
    setValues: (file, values) => {
      state.values.set(file, values);
    },
    hasModule: (file) => {
      return file in manifest.assets;
    },
    getModule: (file) => {
      return manifest.assets[file];
    },
    getValues: (file) => {
      return state.values.get(file) || {};
    },
    getText: modified(memoize((file) => {
      return logFileOperation<string>(`read text`, file, (f) => {
        return f(() => Deno.readTextFile(file));
      });
    })),
    getHash: modified(memoize((file) => {
      return logFileOperation<string>(`hash file`, file, async (f) => {
        const text = await ctx.getText(file);
        return f(() => hashed(text));
      });
    })),
    getProgram: async (file) => {
      const hash = await ctx.getHash(file);
      return state.programs(file, hash);
    },
    getTemplate: async (file) => {
      const hash = await ctx.getHash(file);
      return state.templates(file, hash);
    },
    getRoot: async (file) => {
      const hash = await ctx.getHash(file);
      return await state.roots(file, hash);
    },
    route: async (module, path) => {
      return await logTime("built library", (f) => {
        manifest = module.doc();
        return f(async () => {
          const keys = Object.keys(manifest.assets);
          const library: Record<string, Root> = {};
          for (const file of keys) {
            library[file] = await ctx.getRoot(file);
          }
          const json = JSON.stringify(library);
          logText(`Library size: ${json.length} bytes`);

          return route(library, path);
        });
      });
    },
  };

  const state = {
    values: new Map<string, Record<string, unknown>>(),
    programs: createProgramCache(ctx),
    templates: createTemplateCache(ctx),
    roots: createRootCache(ctx),
  };

  return {
    route: ctx.route,
  };
}
