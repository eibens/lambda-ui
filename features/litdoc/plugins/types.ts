import { Editor, Transforms } from "slate";
import * as Plugins from "./mod.ts";

export type Mixin = {
  type: "root";
};

export function create() {
  return (base: Editor) => {
    const editor = Object.assign(base, {
      type: "root",
    });

    const override = Plugins.Override.create({
      normalizeNode: (entry, next) => {
        const [node, path] = entry;
        if (node.type) return next();
        Transforms.setNodes(editor, { type: "plain" }, { at: path });
      },
    });

    return override(editor);
  };
}
