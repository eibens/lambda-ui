import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";
import { Block } from "./Block.tsx";

export function Call(props: RenderNodeProps<"Call">) {
  const { children, node } = props;

  const content = (
    <View
      class="font-mono"
      tag="span"
      contentEditable={false}
    >
      <View tag="span" class="color-teal">{node.name}</View>
      <View tag="span" class="color-gray">({node.args.length} args)</View>
    </View>
  );

  if (node.isInline) {
    return content;
  }

  return (
    <Block {...props} contentEditable={false}>
      {content}
      {children}
    </Block>
  );
}
