import { RenderNodeProps, View } from "./deps.ts";

export function Token(props: RenderNodeProps<"Token">) {
  const { attributes, children, node } = props;

  return (
    <View
      tag="span"
      {...attributes}
      contentEditable={false}
      class="font-mono"
    >
      {children}
    </View>
  );
}
