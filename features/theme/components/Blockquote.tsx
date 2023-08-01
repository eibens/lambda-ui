import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";
import { Block } from "./Block.tsx";

export function Blockquote(props: RenderNodeProps<"Blockquote">) {
  const { children } = props;
  return (
    <Block {...props}>
      <View
        tag="blockquote"
        class={[
          "flex flex-col px-4 py-3",
          "rounded-lg",
          "shadow-sm color-gray stroke-20 fill-0 border-1",
        ]}
      >
        {children}
      </View>
    </Block>
  );
}
