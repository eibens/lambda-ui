import { parse } from "litdoc/utils/parse.ts";
import { Root } from "litdoc/utils/schema.ts";
import "litdoc/utils/slate.ts";
import { weave } from "litdoc/utils/weave.ts";
import { Editor } from "slate";

/** MAIN **/

export type Client = {
  getEditor: (key: string) => Editor;
};

export type ClientConfig = {
  library: Library;
  modules: {
    [key: string]: unknown;
  };
};

export type Library = {
  [key: string]: Root;
};

export function client(config: ClientConfig): Client {
  const {
    library,
    modules,
  } = config;

  const cache = {
    values: new Map<string, Record<string, unknown>>(),
    editors: new Map<string, Editor>(),
  };

  const get = {
    editor: (key: string) => {
      if (!cache.editors.has(key)) {
        const root = library[key];
        if (!root) {
          throw new Error(`No route found for ${key}`);
        }

        const editor = parse("");
        const module = modules[key];
        const { values } = weave({ type: "Values", module });
        editor.values = values;
        editor.children = root.children;
        cache.editors.set(key, editor);
        return editor;
      }

      return cache.editors.get(key)!;
    },
  };

  return {
    getEditor: get.editor,
  };
}
