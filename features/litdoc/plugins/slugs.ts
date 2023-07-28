import { kebabCase } from "https://esm.sh/tiny-case@1.0.3";
import { Editor, Element, Node, Transforms } from "slate";
import * as Plugins from "./mod.ts";

export function create() {
  return (editor: Editor) => {
    const override = Plugins.Override.create({
      normalizeNode: (entry, next) => {
        const [node, path] = entry;
        if (!Element.isElement(node)) return next();
        if (node.type !== "Heading") return next();

        const slug = kebabCase(Node.string(node));

        if (node.slug === slug) return next();

        Transforms.setNodes(editor, { slug }, { at: path });
      },
    });

    return override(editor);
  };
}
