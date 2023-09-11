import { toValues } from "litdoc/core/utils/weave.ts";
import * as Doc from "litdoc/doc/mod.ts";
import { Root } from "litdoc/doc/mod.ts";
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
  const cache = {
    values: new Map<string, Record<string, unknown>>(),
    editors: new Map<string, Editor>(),
  };

  const get = {
    values: (file: string) => {
      if (!cache.values.has(file)) {
        const mod = config.modules[file];
        const values = toValues(mod);
        cache.values.set(file, values);
        return values;
      }
      return cache.values.get(file)!;
    },
    editor: (key: string) => {
      if (!cache.editors.has(key)) {
        const root = config.library[key];
        const values = get.values(key);

        if (!root) {
          throw new Error(`No route found for ${key}`);
        }

        const editor = Doc.create({
          children: root.children,
          values,
        });
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
