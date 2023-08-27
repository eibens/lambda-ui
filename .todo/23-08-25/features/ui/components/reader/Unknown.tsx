import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";
import { useSlate } from "slate-react";

export function Unknown(props: RenderNodeProps<"Unknown">) {
  const { attributes, children, node } = props;

  const editor = useSlate();
  const isInline = editor.isInline(node);

  return (
    <View
      {...attributes}
      tag={isInline ? "span" : "div"}
      class="color-red fill-10 stroke-50"
      contentEditable={false}
    >
      {children}
    </View>
  );
}
