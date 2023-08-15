import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";
import { useSlate } from "slate-react";
import { getFontSize, getLineHeight, getSpacing } from "../utils/theme.ts";

export function Heading(props: RenderNodeProps<"Heading">) {
  const { attributes, children, node } = props;

  const { depth } = node;

  const i = depth - 1;
  const h = [1, 2, 3, 4, 5, 6][i];
  const H = `h${h}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  const editor = useSlate();
  const size = getFontSize(editor, node);
  const spacing = getSpacing(editor, node);
  const lineHeight = getLineHeight(editor, node);

  return (
    <View
      {...attributes}
      tag={H}
      id={node.slug}
      class={[
        "font-sans font-bold",
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
