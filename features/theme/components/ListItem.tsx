import { RenderNodeProps } from "@litdoc/render";
import { MdIcon, Span, View } from "@litdoc/ui";
import { Block } from "./Block.tsx";

export function ListItem(props: RenderNodeProps<"ListItem">) {
  const { attributes, children, node } = props;
  return (
    <Block {...props}>
      <View
        {...attributes}
        tag="li"
        class="list-none flex"
      >
        <Span>
          <MdIcon>{node.icon ?? "circle"}</MdIcon>
        </Span>
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
