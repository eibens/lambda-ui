import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";
import { Editor, NodeEntry } from "slate";
import { ReactEditor, useSlate } from "slate-react";

/** HELPERS **/

function isLead(editor: Editor, entry: NodeEntry) {
  // is a paragraph directly after a heading (as its sibling)
  const [node, path] = entry;
  if (node.type !== "Paragraph") return false;

  const prevEntry = editor.previous({ at: path });
  if (!prevEntry) return false;

  const [prevNode, prevPath] = prevEntry;
  if (prevNode.type !== "Heading") return false;

  return true;
}

function getSpacing(editor: Editor, entryA?: NodeEntry, entryB?: NodeEntry) {
  // No spacing for first and last nodes.
  if (!entryA || !entryB) return 0;

  const [a, pathA] = entryA ?? [];
  const [b, pathB] = entryB ?? [];

  if (a.type === "Heading" && b.type === "Heading") return 4;
  if (b.type === "Heading") return 24;
  if (a.type === "Heading") return 4;

  if (isLead(editor, entryA)) return 12;

  if (a.type == b.type) return 4;

  const narrow = ["Paragraph", "ListItem", "List"];
  if (narrow.includes(a.type) && narrow.includes(b.type)) return 4;

  return 12;
}

/** MAIN **/

export function Block(
  props: RenderNodeProps & {
    contentEditable?: boolean;
  },
) {
  const { attributes, children, node, contentEditable } = props;

  const editor = useSlate();
  const path = ReactEditor.findPath(editor, node);
  const next = editor.next({ at: path });
  const spacing = getSpacing(editor, [node, path], next);

  return (
    <View
      {...attributes}
      {...{
        "data-slate-type": node.type,
        contentEditable,
      }}
      class={[
        `mb-${spacing}`,
      ]}
    >
      {children}
    </View>
  );
}
