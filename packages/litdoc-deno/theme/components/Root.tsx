import { RenderNodeProps, View } from "./deps.ts";

export function Root(props: RenderNodeProps<"Root">) {
  const { attributes, children } = props;
  return (
    <View
      {...attributes}
    >
      {children}
    </View>
  );
}
