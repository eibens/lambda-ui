import { nanoid } from "https://esm.sh/nanoid@4.0.0";
import { Editor, Node, Path, Transforms } from "slate";
import * as Plugins from "./mod.ts";

export type BaseNode = {
  key?: string;
};

export type Mixin = {
  paths: Record<string, Path>;
};

export function create() {
  return (editor: Editor) => {
    function getKey(node: Node) {
      return Reflect.get(node, "key");
    }

    const mixin: Mixin = {
      paths: {},
    };

    const override = Plugins.Override.create({
      normalizeNode: (entry, next) => {
        const [node, path] = entry;
        const existingKey = getKey(node);
        if (existingKey) return next();
        const key = nanoid();
        Transforms.setNodes(editor, { key }, { at: path });
        mixin.paths[key] = entry[1];
        return key;
      },
      onChange: () => {
        const paths: Record<string, Path> = {};
        for (const entry of editor.nodes({ at: [] })) {
          const [node, path] = entry;
          const key = getKey(node);
          if (!key) return;
          mixin.paths[key] = path;
        }
        mixin.paths = paths;
      },
    });

    return Object.assign(override(editor), mixin);
  };
}
