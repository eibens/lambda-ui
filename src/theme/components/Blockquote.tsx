import { getSpacing, RenderNodeProps, useSlate, View } from "./deps.ts";

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
        "color-gray stroke-10 fill-0 border-4",
      ]}
      style={{
        marginBottom: spacing + "px",
      }}
    >
      {children}
    </View>
  );
}
