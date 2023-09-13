import { join } from "$std/path/join.ts";
import { cached, concurrent, memoized, modified } from "litdoc/cache/mod.ts";
import * as Doc from "litdoc/doc/mod.ts";
import * as Swc from "litdoc/swc/mod.ts";
import { Editor } from "slate";
import * as Hash from "./hash.ts";
import * as Logger from "./logger.ts";
import * as Markdown from "./markdown.ts";
import { Block, toMarkdown, weave } from "./weave.ts";

/** MAIN **/

export type ServerConfig = {
  cacheRoot?: string;
  modules: Record<string, unknown>;
};

export type Server = {
  has: (file: string) => boolean;
  getMarkdown: (file: string) => Promise<string>;
  getEditor: (file: string) => Promise<Editor>;
  getLibrary: () => Promise<Record<string, Doc.Root>>;
};

export function server(config: ServerConfig): Server {
  const {
    modules,
    cacheRoot = ".litdoc/cache",
  } = config;

  const log = Logger.task;

  const cache = {
    library: null as (null | Record<string, Doc.Root>),
    modules,
    values: new Map<string, Record<string, unknown>>(),
    editors: new Map<string, Editor>(),
    program: cached<Swc.Program>({
      ext: "json",
      path: join(cacheRoot, "program"),
      parse: JSON.parse,
      stringify: (value) => JSON.stringify(value, null, 2),
    }),
    blocks: cached({
      ext: "json",
      path: join(cacheRoot, "blocks"),
      parse: JSON.parse,
      stringify: (value) => JSON.stringify(value, null, 2),
    }),
    template: cached({
      ext: "md",
      path: join(cacheRoot, "template"),
      parse: (text: string) => text,
      stringify: (text: string) => text,
    }),
    mdast: cached({
      ext: "json",
      path: join(cacheRoot, "mdast"),
      parse: JSON.parse,
      stringify: (value) => JSON.stringify(value, null, 2),
    }),
    doc: cached({
      ext: "json",
      path: join(cacheRoot, "doc"),
      parse: Doc.parse,
      stringify: Doc.stringify,
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
          return f(() =>
            Swc.parse(text, {
              syntax: "typescript",
              tsx: file.endsWith(".tsx"),
            })
          );
        });
      });
    })),
    blocks: concurrent(memoized((file, hash) => {
      return cache.blocks(file, hash, () => {
        return log(`get blocks`, file, async (f) => {
          const text = await get.text(file);
          const program = await get.program(file);
          const mod = get.module(file);
          return f(() => {
            const { values, children } = weave(mod, program, text);
            cache.values.set(file, values);
            return children;
          });
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
          const root = await get.mdast(file);
          return f(() => {
            const values = cache.values.get(file);
            if (!values) {
              throw new Error(`Values not found for ${file}`);
            }

            const editor = Doc.create({
              children: root.children,
              values: cache.values.get(file) || {},
            });

            return editor;
          });
        });
      });
    })),
  };

  const get = {
    module: (file: string) => {
      return cache.modules[file];
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
    doc: async (file: string): Promise<Editor> => {
      const hash = await get.hash(file);
      return memo.doc(file, hash);
    },
    markdown: (file: string) => {
      // TODO: should render doc as markdown
      return get.template(file);
    },
    root: async (file: string): Promise<Doc.Root> => {
      const doc = await get.doc(file);
      return {
        type: "Root",
        children: doc.children,
      };
    },
    library: async (): Promise<Record<string, Doc.Root>> => {
      if (!cache.library) {
        const keys = Object.keys(modules);
        const library: Record<string, Doc.Root> = {};

        for (const key of keys) {
          const root = await get.root(key);
          library[key] = root;
        }
        cache.library = library;
        return library;
      }
      return cache.library;
    },
    has: (file: string) => {
      return file in modules;
    },
  };

  return {
    has: get.has,
    getMarkdown: get.markdown,
    getEditor: get.doc,
    getLibrary: get.library,
  };
}
