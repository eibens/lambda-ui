import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";
import { Block } from "./Block.tsx";

export function List(props: RenderNodeProps<"List">) {
  const { children, node } = props;
  const { ordered } = node;
  const tag = ordered ? "ol" : "ul";
  const style = ordered ? "list-decimal" : "list-disc";

  return (
    <Block {...props}>
      <View
        tag={tag}
        class={[
          "flex flex-col",
          style,
        ]}
      >
        {children}
      </View>
    </Block>
  );
}
