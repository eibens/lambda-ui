import { join } from "$std/path/join.ts";
import { cached, concurrent, memoized, modified } from "litdoc/cache/mod.ts";
import { hashed } from "litdoc/core/utils/hash.ts";
import { parse, Program } from "litdoc/swc/mod.ts";
import { Block, toMarkdown, weave } from "./utils/weave.ts";

/** MAIN **/

export type Config = {
  cacheRoot?: string;
};

export function create(config: Config = {}) {
  const {
    cacheRoot = ".litdoc/cache",
  } = config;

  const log = (msg: string) => {
    const message = `[litdoc] ${msg}`;
    console.log(message);
  };

  const cache = {
    mod: new Map<string, unknown>(),
    ast: cached<Program>({
      ext: "json",
      path: join(cacheRoot, "ast"),
      parse: JSON.parse,
      stringify: (value) => JSON.stringify(value, null, 2),
    }),
    blocks: cached({
      ext: "json",
      parse: JSON.parse,
      stringify: (value) => JSON.stringify(value, null, 2),
      path: join(cacheRoot, "blocks"),
    }),
    md: cached({
      ext: "md",
      parse: (text: string) => text,
      stringify: (text: string) => text,
      path: join(cacheRoot, "md"),
    }),
  };

  const memo = {
    text: modified(memoized(concurrent(
      (file) => {
        return Deno.readTextFile(file);
      },
    ))),
    hash: modified(memoized(concurrent(
      async (file) => {
        log(`hashing ${file}`);
        const text = await getText(file);
        return hashed(text);
      },
    ))),
    ast: memoized(concurrent((file, hash) => {
      return cache.ast(file, hash, async () => {
        log(`parsing ${file}`);
        const text = await getText(file);
        return parse(text, { syntax: "typescript" });
      });
    })),
    blocks: memoized(concurrent((file, hash) => {
      return cache.blocks(file, hash, async () => {
        log(`weaving ${file}`);
        const ast = await getAst(file);
        const mod = getModule(file);
        return weave(mod, ast);
      });
    })),
    md: memoized(concurrent((file, hash) => {
      return cache.md(file, hash, async () => {
        log(`markdown ${file}`);
        const text = await getText(file);
        const blocks = await getBlocks(file);
        return toMarkdown(blocks, text);
      });
    })),
  };

  /** MAIN **/

  function getModule(file: string): unknown {
    if (!cache.mod.has(file)) throw new Error(`Module not found: ${file}`);
    return cache.mod.get(file)!;
  }

  function getHash(file: string): Promise<string> {
    return memo.hash(file);
  }

  async function getAst(file: string): Promise<Program> {
    const hash = await getHash(file);
    return memo.ast(file, hash);
  }

  async function getBlocks(file: string): Promise<Block[]> {
    const hash = await getHash(file);
    return memo.blocks(file, hash);
  }

  function getText(file: string): Promise<string> {
    return memo.text(file);
  }

  async function getMarkdown(file: string): Promise<string> {
    const hash = await getHash(file);
    return memo.md(file, hash);
  }

  function setModules(modules: Record<string, unknown>): void {
    for (const [path, mod] of Object.entries(modules)) {
      cache.mod.set(path, mod);
    }
  }

  return {
    getMarkdown,
    setModules,
  };
}
