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
  if (a.type === "Heading" && b.type === "Heading") return 4;
  if (b.type === "Heading") return 24;
  if (a.type === "Heading") return 4;

  if (isLead(editor, [node, path])) return 12;

  if (a.type == b.type) return 4;

  const narrow = ["Paragraph", "ListItem", "List"];
  if (narrow.includes(a.type) && narrow.includes(b.type)) return 4;

  return 12;
}
