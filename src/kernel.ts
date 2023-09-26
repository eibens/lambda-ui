import { encode } from "$std/encoding/hex.ts";
import { extname } from "$std/path/extname.ts";
import { fromFileUrl } from "$std/path/from_file_url.ts";
import { join } from "$std/path/join.ts";
import { decompress } from "https://deno.land/x/lz4@v0.1.2/mod.ts";
import { instantiate } from "./assets/swc/deno_swc.generated.js";
import { ParseOptions } from "./assets/swc/deno_swc.ts";
import {
  dumpMemoryMap,
  fromBinaryCache,
  fromCacheMap,
  fromMemoryMap,
  hydrateMemoryMap,
} from "./cache.ts";
import * as Editor from "./editor.ts";
import { logFileOperation } from "./log.ts";
import * as Template from "./template.ts";
import type {
  Bundle,
  Doc,
  File,
  Kernel,
  Manifest,
  Page,
  Program,
  Root,
  Route,
  Value,
} from "./types.ts";

/** HELPERS **/

function typed<T>(value: T): T {
  return value;
}

class SwcLoadError extends Error {
  constructor(url: URL, response: Response) {
    super(
      `Failed to load SWC WASM module.\n${response.status} ${response.statusText}: ${url}`,
    );
  }
}

/** MAIN **/

export type State = ReturnType<typeof create>;

export function create(main: Manifest, options: {
  cacheRoot?: string;
  swcWasmUrl?: URL;
  storage?: "memory" | "disk";
} = {}): Kernel {
  const {
    storage = "memory",
    cacheRoot = ".litdoc/cache",
    swcWasmUrl = new URL(
      "./assets/swc/deno_swc_bg.wasm",
      import.meta.url,
    ),
  } = options;

  return {
    main,
    swcWasmUrl,
    manifests: {},
    files: {},
    swc: {
      storage,
      file: join(cacheRoot, "swc.wasm"),
      memory: {},
      decompress,
    },
    programs: {
      storage,
      extension: "json",
      prefix: cacheRoot,
      postfix: "program",
      parse: JSON.parse,
      stringify: JSON.stringify,
      memory: {},
    },
    templates: {
      storage,
      extension: "md",
      prefix: cacheRoot,
      postfix: "template",
      parse: typed,
      stringify: typed,
      memory: {},
    },
    roots: {
      storage,
      extension: "json",
      prefix: cacheRoot,
      postfix: "root",
      parse: JSON.parse,
      stringify: JSON.stringify,
      memory: {},
    },
    pages: {
      storage,
      extension: "json",
      prefix: cacheRoot,
      postfix: "page",
      parse: JSON.parse,
      stringify: JSON.stringify,
      memory: {},
    },
  };
}

export function getManifest(state: Kernel, key: string): Manifest | null {
  const mod = state.main.assets?.[key];
  if (mod == null) return null;
  if (typeof mod !== "object") return null;
  if (!("doc" in mod)) return null;
  if (typeof mod.doc !== "function") return null;
  const doc = mod.doc as Doc;
  return doc();
}

export async function getFile(state: Kernel, key: string): Promise<File> {
  const url = new URL(key, state.main.baseUrl);
  const file = fromFileUrl(url);
  const stat = await Deno.stat(file);
  const mtime = stat.mtime?.getTime() ?? Date.now();
  const version = String(mtime);
  return fromMemoryMap(state.files, { key, version }, () => {
    return logFileOperation("read file", key, async () => {
      const text = await Deno.readTextFile(file);

      const buffer = new TextEncoder().encode(text);
      const hash = await crypto.subtle.digest("SHA-256", buffer);
      const decoder = new TextDecoder();
      const checksum = decoder.decode(encode(new Uint8Array(hash))).slice(0, 8);
      return { text, version: checksum, key };
    });
  });
}

export function getSwc(state: Kernel): Promise<Uint8Array> {
  return fromBinaryCache(state.swc, () => {
    const url = state.swcWasmUrl;
    return logFileOperation("load swc", url.href, async () => {
      const response = await fetch(url);
      if (!response.ok) throw new SwcLoadError(url, response);
      return new Uint8Array(await response.arrayBuffer());
    });
  });
}

export async function getProgram(
  state: Kernel,
  key: string,
): Promise<Program | null> {
  const language = extname(key).slice(1);
  const isTypescript = ["ts", "tsx"].includes(language);
  const isJavascript = ["js", "jsx"].includes(language);
  const isScript = isTypescript || isJavascript;

  if (!isScript) return null;

  const file = await getFile(state, key);
  return fromCacheMap(state.programs, file, async () => {
    const syntax = isTypescript ? "typescript" : "ecmascript";
    const wasm = await getSwc(state);
    return logFileOperation("parse program", key, async () => {
      const { parseSync } = await instantiate(wasm);
      const parse = parseSync as (
        text: string,
        options: ParseOptions,
      ) => Program;
      const tsx = ["tsx", "jsx"].includes(language);
      return parse(file.text, {
        syntax,
        tsx,
      });
    });
  });
}

export async function getTemplate(state: Kernel, key: string) {
  const file = await getFile(state, key);
  return fromCacheMap(state.templates, file, async () => {
    const manifest = getManifest(state, key);
    const calls = manifest?.calls ?? [];

    const program = await getProgram(state, key);
    if (!program) {
      return Template.stringifyCalls(calls);
    }

    return logFileOperation("generate markdown", key, () => {
      const { text } = file;
      return Template.stringifyProgram({ text, calls, program });
    });
  });
}

export async function getRoot(state: Kernel, key: string) {
  const file = await getFile(state, key);
  return fromCacheMap(state.roots, file, async (): Promise<Root> => {
    const lang = extname(key).slice(1);
    const { text } = file;

    if (lang === "md") {
      return logFileOperation("parse markdown", key, () => {
        return Template.parse(text);
      });
    }

    const manifest = getManifest(state, key);
    if (manifest) {
      const template = await getTemplate(state, key);
      return logFileOperation("parse markdown", key, () => {
        return Template.parse(template);
      });
    }

    return {
      type: "Root",
      children: [{
        type: "Code",
        lang,
        children: [{ type: "Text", text }],
      }],
    };
  });
}

export async function getPage(state: Kernel, key: string): Promise<Page> {
  const file = await getFile(state, key);
  return fromCacheMap(state.pages, file, async () => {
    const root = await getRoot(state, key);
    return logFileOperation("page", key, () => {
      const editor = Editor.create(root);
      const links = Editor.getLinks(editor);
      const relations = links
        .map((link) => {
          const route = routeHref(state, link.url);
          if (!route) return null;
          return route;
        })
        .filter(Boolean) as Route[];

      return {
        icon: Editor.getIcon(editor),
        title: Editor.getTitle(editor) ?? "Untitled",
        description: Editor.getLead(editor),
        color: Editor.getColor(editor),
        breadcrumbs: [],
        relations,
      };
    });
  });
}

export async function getMemory(state: Kernel): Promise<Bundle> {
  return {
    files: await dumpMemoryMap(state.files),
    programs: await dumpMemoryMap(state.programs.memory),
    templates: await dumpMemoryMap(state.templates.memory),
    roots: await dumpMemoryMap(state.roots.memory),
    pages: await dumpMemoryMap(state.pages.memory),
  };
}

export function setMemory(state: Kernel, bundle: Partial<Bundle>) {
  const {
    files = {},
    programs = {},
    templates = {},
    roots = {},
    pages = {},
  } = bundle;

  const versions = Object.fromEntries(
    Object.entries(files).map(([key, { version }]) => [key, version]),
  );

  hydrateMemoryMap(state.files, files, versions);
  hydrateMemoryMap(state.programs.memory, programs, versions);
  hydrateMemoryMap(state.templates.memory, templates, versions);
  hydrateMemoryMap(state.roots.memory, roots, versions);
  hydrateMemoryMap(state.pages.memory, pages, versions);
}

export function route(kernel: Kernel, path: string): Route | null {
  const { main } = kernel;
  const module = main.routes?.[path];
  for (const key in main.assets) {
    const ref = main.assets[key];
    if (ref === module) {
      const manifest = getManifest(kernel, key);
      const calls = manifest?.calls ?? [];
      const values = calls
        .flatMap((call) => call.args.slice(1) as Value[])
        .reduce<Record<string, Value>>(
          (values, value, i) => ({ ...values, [i]: value }),
          {},
        );
      return {
        key,
        values,
        path,
      };
    }
  }

  return null;
}

export function routeHref(kernel: Kernel, href: string): Route | null {
  function getRoute(path: string) {
    try {
      const url = new URL(path);
      return {
        url,
        target: "external" as const,
      };
    } catch (_) {
      try {
        const url = new URL(path, "http://example.com");
        return {
          url,
          target: "internal" as const,
        };
      } catch (_) {
        throw new Error(`Invalid route: ${path}`);
      }
    }
  }

  const path = getRoute(href).url.pathname;
  return route(kernel, path);
}

export function bundle(kernel: Kernel, key: string): Promise<Bundle> {
  return logFileOperation("bundle", key, async () => {
    const page = await getPage(kernel, key);
    const root = await getRoot(kernel, key);
    const program = await getProgram(kernel, key);
    const template = await getTemplate(kernel, key);
    const file = await getFile(kernel, key);
    const linkedKeys = page.relations
      .map((item) => route(kernel, item.path))
      .filter(Boolean)
      .map((route) => route as Route)
      .map((route) => route.key);

    const linkedPages = Object.fromEntries(
      await Promise.all(
        linkedKeys
          .filter(Boolean)
          .map(async (key) => [key, await getPage(kernel, key as string)]),
      ),
    );

    return {
      pages: { [key]: page, ...linkedPages },
      files: { [key]: file },
      programs: program ? { [key]: program } : {},
      templates: { [key]: template },
      roots: { [key]: root },
    };
  });
}

export async function pages(kernel: Kernel): Promise<Bundle> {
  const { main } = kernel;
  const { routes = {} } = main;

  const keys = Object.keys(routes);
  const pages = Object.fromEntries(
    await Promise.all(
      keys.map(async (key) => [key, await getPage(kernel, key)]),
    ),
  );

  return {
    pages,
    files: {},
    programs: {},
    templates: {},
    roots: {},
  };
}
