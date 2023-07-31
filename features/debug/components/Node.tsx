import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";

export function Node(props: RenderNodeProps) {
  const { attributes, children, node } = props;
  return (
    <View
      {...attributes}
      class={[
        "debug-node",
      ]}
    >
      <View class="color-teal font-mono">{node.type}</View>
      {children}
    </View>
  );
}
