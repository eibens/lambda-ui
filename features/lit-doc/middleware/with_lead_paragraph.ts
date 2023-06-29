import { Element, Transforms } from "slate";
import { withEditor } from "./with_editor.ts";
import { withNormalizeNode } from "./with_normalize_node.ts";

/** HELPERS **/

export function withLeadParagraph() {
  const editor = withEditor();

  withNormalizeNode((entry, next) => {
    const [node, path] = entry;

    // We look for a paragraph that is the second child of the root.
    // { type: "root", children: [{ ...title }, { type: "paragraph", ...}] }
    if (
      Element.isElement(node) &&
      node.type === "paragraph" &&
      // Prevent infinite normalization loop.
      node.isLead === undefined &&
      // Only consider top level paragraphs inside root element.
      path.length === 2 &&
      // Lead paragraph is the second child (after the header).
      path[1] === 1
    ) {
      Transforms.setNodes(editor, { isLead: true }, { at: path });
      return;
    }
    next();
  });
}
