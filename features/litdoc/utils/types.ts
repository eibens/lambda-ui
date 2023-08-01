import { Editor, Node, Text } from "slate";
import * as Override from "./override.ts";

/** HELPERS **/

const inlineTypes: NodeType[] = [
  "Emphasis",
  "Strong",
  "Delete",
  "Link",
  "Icon",
];

const voidTypes: NodeType[] = [
  "ThematicBreak",
  "Icon",
  "Image",
  "Html",
  "Break",
  "FootnoteReference",
  "LinkReference",
];

/** MAIN **/

export type NodeType = Node["type"];

export function plugin() {
  return (base: Editor) => {
    const editor = Object.assign(base, {
      type: "Root",
    });

    const override = Override.create({
      normalizeNode: (entry, next) => {
        const [node, path] = entry;
        if (node.type) return next();
        const isEmptyText = Text.isText(node) && editor.string(path) === "";
        const type = isEmptyText ? "Text" : "Unknown";
        editor.setNodes({ type }, { at: path });
      },
      isInline: (node) => {
        if ("isInline" in node) return Boolean(node.isInline);
        if (inlineTypes.includes(node.type)) return true;
        return false;
      },
      isVoid: (node) => voidTypes.includes(node.type),
    });

    return override(editor);
  };
}
