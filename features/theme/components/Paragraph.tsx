import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";
import { ReactEditor, useSlate } from "slate-react";
import { Block } from "./Block.tsx";

export function Paragraph(props: RenderNodeProps<"Paragraph">) {
  const { children, node } = props;

  const editor = useSlate();
  const path = ReactEditor.findPath(editor, node);
  const prev = editor.previous({ at: path });

  const isLead = prev && prev[0].type === "Heading" && prev[0].depth === 1;

  return (
    <Block {...props}>
      <View
        tag="p"
        class={[
          isLead ? "text-2xl" : "",
          "text-gray-700 dark:text-gray-300",
          "whitespace-normal",
        ]}
      >
        {children}
      </View>
    </Block>
  );
}
