import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";

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
