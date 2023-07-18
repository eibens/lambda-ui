import { nanoid } from "https://esm.sh/nanoid@4.0.0";
import { Editor, Path, Transforms } from "slate";
import * as Plugins from "./mod.ts";

export type BaseNode = {
  key?: string;
};

export type Mixin = {
  paths: Record<string, Path>;
  lookup: (key?: string) => Path | undefined;
};

export function create() {
  return (editor: Editor) => {
    const mixin: Mixin = {
      paths: {},
      lookup: (key) => {
        if (key === undefined) return;
        return mixin.paths[key];
      },
    };

    const override = Plugins.Override.create({
      normalizeNode: (entry, next) => {
        const [node, path] = entry;
        if (Reflect.has(node, "key")) return next();
        const key = nanoid();
        Transforms.setNodes(editor, { key }, { at: path });
        mixin.paths[key] = path;
      },
      onChange: () => {
        const paths: Record<string, Path> = {};
        for (const [node, path] of editor.nodes({ at: [] })) {
          const key = Reflect.get(node, "key");
          if (key) {
            paths[key] = path;
          }
        }
        mixin.paths = paths;
      },
    });

    return Object.assign(override(editor), mixin);
  };
}
