import { join } from "$std/path/join.ts";
import { extname } from "$std/path/mod.ts";
import { parse as parseSwc } from "litdoc/services/swc.ts";
import { cached } from "litdoc/utils/cached.ts";
import { hashed } from "litdoc/utils/hashed.ts";
import { logFileOperation, logTime } from "litdoc/utils/log.ts";
import { memoize } from "litdoc/utils/memoize.ts";
import { modified } from "litdoc/utils/modified.ts";
import { parse } from "litdoc/utils/parse.ts";
import type { Root } from "litdoc/utils/schema.ts";
import "litdoc/utils/slate.ts";
import type { Program } from "litdoc/utils/swc.ts";
import { weave, WeaveOptions } from "litdoc/utils/weave.ts";
import { Editor } from "slate";

/** HELPERS **/

async function getWeaveOptions(
  ctx: ServerContext,
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

function createProgramCache(ctx: ServerContext) {
  const { getConfig, getText } = ctx;
  const { cacheRoot } = getConfig();
  return cached<Program>({
    ext: "json",
    path: join(cacheRoot, "program"),
    log: "parse program",
    parse: JSON.parse,
    stringify: (value) => JSON.stringify(value),
    load: async (file, f) => {
      const text = await getText(file);
      return f(() =>
        parseSwc(text, {
          syntax: "typescript",
          tsx: file.endsWith(".tsx"),
        })
      );
    },
  });
}

function createTemplateCache(ctx: ServerContext) {
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

function createEditorCache(ctx: ServerContext) {
  const { getConfig, getTemplate, getValues } = ctx;
  const { cacheRoot } = getConfig();
  return cached({
    ext: "json",
    path: join(cacheRoot, "doc"),
    log: "parse markdown",
    parse: (string: string) => {
      const root = JSON.parse(string);
      const editor = parse("");
      editor.children = root.children;
      return editor;
    },
    stringify: (editor: Editor) => {
      const root: Root = {
        type: "Root",
        children: editor.children,
      };
      return JSON.stringify(root);
    },
    load: async (file, f) => {
      const template = await getTemplate(file);
      const values = getValues(file);
      if (!values) throw new Error(`Values not found for ${file}`);
      return f(() => {
        const editor = parse(template);
        editor.values = values;
        return editor;
      });
    },
  });
}

/** MAIN **/

export type ServerConfig = {
  cacheRoot: string;
  modules: Record<string, unknown>;
};

export type ServerContext = {
  hasModule: (file: string) => boolean;
  getConfig: () => ServerConfig;
  getValues: (file: string) => Record<string, unknown>;
  getModule: (file: string) => unknown;
  getText: (file: string) => Promise<string>;
  getHash: (file: string) => Promise<string>;
  getProgram: (file: string) => Promise<Program>;
  getTemplate: (file: string) => Promise<string>;
  getEditor: (file: string) => Promise<Editor>;
  getLibrary: () => Promise<Record<string, Root>>;
  setValues: (file: string, values: Record<string, unknown>) => void;
};

export function server(config: Partial<ServerConfig> = {}): ServerContext {
  const {
    modules = {},
    cacheRoot = ".litdoc/cache",
  } = config;

  const ctx: ServerContext = {
    getConfig: () => {
      return {
        cacheRoot,
        modules,
      };
    },
    hasModule: (file: string) => {
      return file in modules;
    },
    getModule: (file: string) => {
      return modules[file];
    },
    getValues: (file) => {
      return state.values.get(file) || {};
    },
    setValues: (file, values) => {
      state.values.set(file, values);
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
    getProgram: async (file: string): Promise<Program> => {
      const hash = await ctx.getHash(file);
      return state.program(file, hash);
    },
    getTemplate: async (file: string): Promise<string> => {
      const hash = await ctx.getHash(file);
      return state.template(file, hash);
    },
    getEditor: async (file: string): Promise<Editor> => {
      const hash = await ctx.getHash(file);
      return state.editor(file, hash);
    },
    getLibrary: async (): Promise<Record<string, Root>> => {
      if (!state.library) {
        return await logTime("built library", (f) => {
          return f(async () => {
            const keys = Object.keys(modules);
            const library: Record<string, Root> = {};
            for (const file of keys) {
              const { children } = await ctx.getEditor(file);
              library[file] = { type: "Root", children };
            }
            state.library = library;
            return library;
          });
        });
      }
      return state.library;
    },
  };

  const state = {
    library: null as (null | Record<string, Root>),
    values: new Map<string, Record<string, unknown>>(),
    editors: new Map<string, Editor>(),
    program: createProgramCache(ctx),
    template: createTemplateCache(ctx),
    editor: createEditorCache(ctx),
  };

  return ctx;
}
