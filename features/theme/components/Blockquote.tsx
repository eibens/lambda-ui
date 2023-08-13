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
          "flex flex-col p-4",
          "rounded-xl",
          "shadow-sm color-gray stroke-10 fill-0 border-4",
        ]}
      >
        {children}
      </View>
    </Block>
  );
}
