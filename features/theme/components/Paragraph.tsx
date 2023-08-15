import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";
import { useSlate } from "slate-react";
import { getFontSize, getLineHeight, getSpacing } from "../utils/theme.ts";

export function Paragraph(props: RenderNodeProps<"Paragraph">) {
  const { attributes, children, node } = props;

  const editor = useSlate();
  const size = getFontSize(editor, node);
  const spacing = getSpacing(editor, node);
  const lineHeight = getLineHeight(editor, node);

  return (
    <View
      {...attributes}
      tag="p"
      class={[
        "text-gray-700 dark:text-gray-300",
        "whitespace-normal",
      ]}
      style={{
        lineHeight: lineHeight + "px",
        fontSize: size + "px",
        marginBottom: spacing + "px",
      }}
    >
      {children}
    </View>
  );
}
