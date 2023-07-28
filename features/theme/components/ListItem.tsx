import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";
import { Block } from "./Block.tsx";

export function ListItem(props: RenderNodeProps<"ListItem">) {
  const { attributes, children } = props;
  return (
    <Block {...props}>
      <View
        {...attributes}
        tag="li"
      >
        <View
          class={[
            "flex flex-col",
          ]}
        >
          {children}
        </View>
      </View>
    </Block>
  );
}
