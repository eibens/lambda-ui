import { RenderNodeProps } from "@litdoc/render";
import { Span } from "@litdoc/ui";

export function Text(props: RenderNodeProps<"Text">) {
  const { attributes, children } = props;

  return (
    <View tag="span" {...attributes}>
      {children}
    </View>
  );
}