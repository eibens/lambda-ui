import { Editor, Node, NodeEntry } from "slate";
import { ReactEditor } from "slate-react";

/** HELPERS **/

function isLead(editor: Editor, entry: NodeEntry) {
  // is a paragraph directly after a heading (as its sibling)
  const [node, path] = entry;
  if (node.type !== "Paragraph") return false;

  const prevEntry = editor.previous({ at: path });
  if (!prevEntry) return false;

  const [prevNode] = prevEntry;
  if (prevNode.type !== "Heading") return false;

  return true;
}

/** MAIN **/

export function getSpacing(editor: Editor, node: Node) {
  const path = ReactEditor.findPath(editor, node);
  const next = editor.next({ at: path });

  // No spacing for last nodes.
  if (!next) return 0;

  const [a, b] = [node, next[0]];
  if (a.type === "Heading" && b.type === "Heading") return 16;
  if (b.type === "Heading") return 96;
  if (a.type === "Heading") return 16;

  if (isLead(editor, [node, path])) return 48;

  if (a.type == b.type) return 16;

  const narrow = ["Paragraph", "ListItem", "List"];
  if (narrow.includes(a.type) && narrow.includes(b.type)) return 16;

  return 48;
}

export function getFontSize(editor: Editor, node: Node) {
  if (node.type === "Heading") {
    const i = node.depth - 1;
    const s = [8, 6, 4, 3, 2, 1][i] * 4 + 16;
    return s;
  }

  if (node.type === "ListItem") {
    const firstChild = node.children[0];
    return getFontSize(editor, firstChild);
  }

  const path = ReactEditor.findPath(editor, node);

  const baseSize = 16;

  const prevEntry = editor.previous({ at: path });
  if (!prevEntry) return baseSize;

  const [prevNode] = prevEntry;
  if (prevNode.type !== "Heading") return baseSize;

  const level = prevNode.depth;
  return baseSize + (6 - level) * 2;
}

export function getLineHeight(editor: Editor, node: Node) {
  return getFontSize(editor, node) * 1.5;
}

export function getListIndent(editor: Editor, node: Node) {
  // should be equal to largest font size
  // otherwise icons will not fit in the space
  return 48;
}
