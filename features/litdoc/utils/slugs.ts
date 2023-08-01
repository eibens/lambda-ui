import { kebabCase } from "https://esm.sh/tiny-case@1.0.3";
import { Editor, Node, NodeEntry, Transforms } from "slate";
import * as Override from "./override.ts";

export function replace(editor: Editor, entry: NodeEntry) {
  const [node, path] = entry;

  if (node.type !== "Heading") return false;

  const slug = kebabCase(Node.string(node));

  if (node.slug === slug) return false;

  Transforms.setNodes(editor, { slug }, { at: path });
}

export function plugin() {
  return (editor: Editor) => {
    const override = Override.create({
      normalizeNode: (entry, next) => {
        if (!replace(editor, entry)) next();
      },
    });

    return override(editor);
  };
}
