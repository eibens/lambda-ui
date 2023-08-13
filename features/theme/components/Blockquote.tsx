import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";
import { useSlate } from "slate-react";
import { getSpacing } from "../utils/theme.ts";

export function Blockquote(props: RenderNodeProps<"Blockquote">) {
  const { attributes, children, node } = props;

  const editor = useSlate();
  const spacing = getSpacing(editor, node);

  return (
    <View
      tag="blockquote"
      {...attributes}
      class={[
        "flex flex-col p-4",
        "rounded-xl",
        "shadow-sm color-gray stroke-10 fill-0 border-4",
        `mb-${spacing}`,
      ]}
    >
      {children}
    </View>
  );
}
