import { kebabCase } from "https://esm.sh/tiny-case@1.0.3";
import { Element, Node, Transforms } from "slate";
import { withEditor } from "./with_editor.ts";
import { withNormalizeNode } from "./with_normalize_node.ts";

/** HELPERS **/

export function withSlugs() {
  const editor = withEditor();

  withNormalizeNode((entry, next) => {
    const [node, path] = entry;
    if (
      Element.isElement(node) &&
      node.type === "heading"
    ) {
      const slug = kebabCase(Node.string(node));

      // Prevent infinite loop.
      if (node.slug !== slug) {
        Transforms.setNodes(editor, { slug }, { at: path });
        return;
      }
    }
    next();
  });
}
