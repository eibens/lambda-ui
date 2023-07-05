import { nanoid } from "https://esm.sh/nanoid@4.0.0";
import { Element, Transforms } from "slate";
import { withEditor } from "./with_editor.ts";
import { withNormalizeNode } from "./with_normalize_node.ts";

/** HELPERS **/

export function withKeys() {
  const editor = withEditor();

  withNormalizeNode((entry, next) => {
    const [node, path] = entry;
    if (
      Element.isElement(node) &&
      node.key == null
    ) {
      const key = nanoid();
      Transforms.setNodes(editor, { key }, { at: path });

      // Prevent infinite loop.
      return;
    }
    next();
  });
}
