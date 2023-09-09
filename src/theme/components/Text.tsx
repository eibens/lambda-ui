import { RenderNodeProps, View } from "./deps.ts";

export function Text(props: RenderNodeProps<"Text">) {
  const { attributes, children } = props;

  return (
    <View tag="span" {...attributes}>
      {children}
    </View>
  );
}
