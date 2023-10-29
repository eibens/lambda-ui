import { join } from "$std/path/join.ts";
import type { Manifest } from "litdoc/lit.ts";
import * as Compiler from "./compiler.ts";
import { Page } from "./editor.ts";
import * as Loader from "./loader.ts";
import type { Root } from "./markdown.ts";
import * as Router from "./router.ts";
import * as Storage from "./storage.ts";
import type { Program } from "./swc.ts";

/** MAIN **/

export type Bundle = {
  texts: Record<string, string>;
  templates: Record<string, string | null>;
  programs: Record<string, Program>;
  roots: Record<string, Root>;
  pages: Record<string, Page>;
};

export type Context = {
  getKey: (path: string) => string | null;
  getPage: (key: string) => Promise<Page>;
  getBundle: (key: string) => Promise<Bundle>;
};

export function create(main: Manifest, options: {
  cachePath?: string;
} = {}) {
  const { cachePath = ".litdoc/cache" } = options;
  const rootPath = main.baseUrl ?? ".";

  const cachedVersions = Storage.memory();

  const cache = Storage.resolve(
    Storage.files(),
    (key) => join(cachePath, key),
  );

  const files = Loader.resolve(
    Loader.files(),
    (key) => join(rootPath, key),
  );

  const versions = Loader.resolve(
    Loader.func(async (key) => {
      const stat = await Deno.stat(key);
      return String(stat.mtime?.getTime() ?? Date.now());
    }),
    (key) => join(rootPath, key),
  );

  const imports = Loader.func((key) => {
    const assets = main.assets[key];
    return Promise.resolve(assets);
  });

  const compiler = Compiler.create({
    cache,
    read: files.get,
    import: imports.get,
  });

  async function invalidate(key: string) {
    const version = await versions.get(key);
    const cachedVersion = cachedVersions.get(key);
    if (cachedVersion === version) return;
    compiler.invalidate(key);
    cachedVersions.set(key, version);
  }

  async function bundle(key: string): Promise<Bundle> {
    await invalidate(key);
    return {
      texts: { [key]: await compiler.getText(key) },
      templates: { [key]: await compiler.getTemplate(key) },
      programs: { [key]: await compiler.getProgram(key) },
      roots: { [key]: await compiler.getRoot(key) },
      pages: { [key]: await compiler.getPage(key) },
    };
  }

  return {
    getBundle: (key: string) => bundle(key),
    getPage: (key: string) => {
      return compiler.getPage(key);
    },
    getKey: (path: string) => {
      const result = Router.resolve(main, path);
      if (!result) return null;
      return result.key;
    },
  };
}
