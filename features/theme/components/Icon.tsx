import { RenderNodeProps } from "@litdoc/render";
import { MdIcon, View } from "@litdoc/ui";

export function Icon(props: RenderNodeProps<"Icon">) {
  const { attributes, children, node } = props;

  return (
    <View
      tag="span"
      {...attributes}
      contentEditable={false}
    >
      <MdIcon>{node.name}</MdIcon>
      {children}
    </View>
  );
}
