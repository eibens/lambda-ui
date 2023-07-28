import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";
import { Editor, NodeEntry, Path } from "slate";
import { ReactEditor, useSlate } from "slate-react";

/** HELPERS **/

function getSpacing(editor: Editor, entryA?: NodeEntry, entryB?: NodeEntry) {
  // No spacing for first and last nodes.
  if (!entryA || !entryB) return 0;

  const [a, pathA] = entryA ?? [];
  const [b, pathB] = entryB ?? [];

  if (a.type == b.type) return 3;

  if (b.type === "Heading") return 24;

  const isLead = !Path.hasPrevious(pathA);

  if (isLead) {
    if (a.type === "Heading" && b.type === "Paragraph") {
      return 3;
    }
  }

  const narrow = ["Paragraph", "ListItem", "List"];
  if (narrow.includes(a.type) && narrow.includes(b.type)) return 3;

  return 12;
}

/** MAIN **/

export function Block(props: RenderNodeProps) {
  const { attributes, children, node } = props;

  const editor = useSlate();
  const path = ReactEditor.findPath(editor, node);
  const next = editor.next({ at: path });
  const spacing = getSpacing(editor, [node, path], next);

  return (
    <View
      {...attributes}
      {...{
        "data-slate-type": node.type,
        "data-slate-key": node.key,
      }}
    >
      {children}
      {next && (
        <View
          contentEditable={false}
          class={[
            "flex",
            `h-${spacing}`,
          ]}
        />
      )}
    </View>
  );
}
