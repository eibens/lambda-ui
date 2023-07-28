import { Editor, Node, Transforms } from "slate";
import * as Override from "./override.ts";

/** HELPERS **/

type NodeType = Node["type"];

const inlineTypes: NodeType[] = [
  "Emphasis",
  "Strong",
  "Link",
  "LinkReference",
  "InlineCode",
  "Delete",
  "Icon",
];

const voidTypes: NodeType[] = [
  "Value",
  "ThematicBreak",
  "Code",
  "Icon",
  "Image",
  "Html",
  "Break",
  "FootnoteReference",
];

/** MAIN **/

export function create() {
  return (base: Editor) => {
    const editor = Object.assign(base, {
      type: "Root",
    });

    const override = Override.create({
      normalizeNode: (entry, next) => {
        const [node, path] = entry;
        if (node.type) return next();
        Transforms.setNodes(editor, { type: "Unknown" }, { at: path });
      },
      isInline: (node) => {
        if (inlineTypes.includes(node.type)) return true;
        return false;
      },
      isVoid: (node) => voidTypes.includes(node.type),
    });

    return override(editor);
  };
}
