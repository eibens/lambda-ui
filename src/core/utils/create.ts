import { join } from "$std/path/join.ts";
import { cached, concurrent, memoized, modified } from "litdoc/cache/mod.ts";
import * as Doc from "litdoc/doc/mod.ts";
import * as Swc from "litdoc/swc/mod.ts";
import * as Hash from "./hash.ts";
import * as Logger from "./logger.ts";
import * as Markdown from "./markdown.ts";
import { Block, toMarkdown, weave } from "./weave.ts";

/** MAIN **/

export type Config = {
  cacheRoot?: string;
};

export type Context = {
  getMarkdown: (file: string) => Promise<string>;
  getDoc: (file: string) => Promise<Doc.Root>;
  setModules: (modules: Record<string, unknown>) => void;
};

export function create(config: Config = {}): Context {
  const {
    cacheRoot = ".litdoc/cache",
  } = config;

  const log = Logger.task;

  const cache = {
    module: new Map<string, unknown>(),
    program: cached<Swc.Program>({
      ext: "json",
      path: join(cacheRoot, "program"),
      parse: JSON.parse,
      stringify: (value) => JSON.stringify(value, null, 2),
    }),
    blocks: cached({
      ext: "json",
      parse: JSON.parse,
      stringify: (value) => JSON.stringify(value, null, 2),
      path: join(cacheRoot, "blocks"),
    }),
    template: cached({
      ext: "md",
      parse: (text: string) => text,
      stringify: (text: string) => text,
      path: join(cacheRoot, "template"),
    }),
    mdast: cached({
      ext: "json",
      parse: JSON.parse,
      stringify: (value) => JSON.stringify(value, null, 2),
      path: join(cacheRoot, "mdast"),
    }),
    doc: cached({
      ext: "json",
      parse: JSON.parse,
      stringify: (value) => JSON.stringify(value, null, 2),
      path: join(cacheRoot, "doc"),
    }),
  };

  const memo = {
    text: modified(concurrent(memoized(
      (file) => {
        return log<string>(`read text`, file, (f) => {
          return f(() => Deno.readTextFile(file));
        });
      },
    ))),
    hash: modified(concurrent(memoized(
      (file) => {
        return log<string>(`hash file`, file, async (f) => {
          const text = await get.text(file);
          return f(() => Hash.generate(text));
        });
      },
    ))),
    program: memoized(concurrent((file, hash) => {
      return cache.program(file, hash, () => {
        return log(`parse typescript`, file, async (f) => {
          const text = await get.text(file);
          return f(() => Swc.parse(text, { syntax: "typescript" }));
        });
      });
    })),
    blocks: concurrent(memoized((file, hash) => {
      return cache.blocks(file, hash, () => {
        return log(`get blocks`, file, async (f) => {
          const program = await get.program(file);
          const mod = get.module(file);
          return f(() => weave(mod, program));
        });
      });
    })),
    template: concurrent(memoized((file, hash) => {
      return cache.template(file, hash, () => {
        return log(`print template`, file, async (f) => {
          const text = await get.text(file);
          const blocks = await get.blocks(file);
          return f(() => toMarkdown(blocks, text));
        });
      });
    })),
    mdast: concurrent(memoized((file, hash) => {
      return cache.mdast(file, hash, () => {
        return log(`parse template `, file, async (f) => {
          const md = await get.template(file);
          return f(() => Markdown.parse(md));
        });
      });
    })),
    doc: concurrent(memoized((file, hash) => {
      return cache.doc(file, hash, () => {
        return log(`parse markdown `, file, async (f) => {
          const ast = await get.mdast(file);
          return f(() => Doc.create(ast));
        });
      });
    })),
  };

  const get = {
    module: (file: string) => {
      if (!cache.module.has(file)) throw new Error(`Module not found: ${file}`);
      return cache.module.get(file)!;
    },
    text: (file: string): Promise<string> => {
      return memo.text(file);
    },
    hash: (file: string) => {
      return memo.hash(file);
    },
    program: async (file: string): Promise<Swc.Program> => {
      const hash = await get.hash(file);
      return memo.program(file, hash);
    },
    blocks: async (file: string): Promise<Block[]> => {
      const hash = await get.hash(file);
      return memo.blocks(file, hash);
    },
    template: async (file: string): Promise<string> => {
      const hash = await get.hash(file);
      return memo.template(file, hash);
    },
    mdast: async (file: string): Promise<Doc.Root> => {
      const hash = await get.hash(file);
      return memo.mdast(file, hash);
    },
    doc: async (file: string): Promise<Doc.Root> => {
      const hash = await get.hash(file);
      return memo.doc(file, hash);
    },
    markdown: (file: string) => {
      // TODO: should render doc as markdown
      return get.template(file);
    },
  };

  function setModules(modules: Record<string, unknown>): void {
    for (const [path, mod] of Object.entries(modules)) {
      cache.module.set(path, mod);
    }
  }
  return {
    getMarkdown: get.markdown,
    getDoc: get.doc,
    setModules,
  };
}
