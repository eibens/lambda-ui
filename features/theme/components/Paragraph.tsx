import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";
import { Editor, NodeEntry } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { Block } from "./Block.tsx";

function getFontSize(editor: Editor, entry: NodeEntry) {
  const [node, path] = entry;

  const baseSize = 16;

  const prevEntry = editor.previous({ at: path });
  if (!prevEntry) return baseSize;

  const [prevNode, prevPath] = prevEntry;
  if (prevNode.type !== "Heading") return baseSize;

  const isLead = prevPath[path.length - 1] === 0;
  if (!isLead) return baseSize;

  const level = prevNode.depth;
  return baseSize + (6 - level) * 2;
}

export function Paragraph(props: RenderNodeProps<"Paragraph">) {
  const { children, node } = props;

  const editor = useSlate();
  const path = ReactEditor.findPath(editor, node);
  const size = getFontSize(editor, [node, path]);

  return (
    <Block {...props}>
      <View
        tag="p"
        class={[
          `text-[${size}px]`,
          "text-gray-700 dark:text-gray-300",
          "whitespace-normal",
        ]}
      >
        {children}
      </View>
    </Block>
  );
}
