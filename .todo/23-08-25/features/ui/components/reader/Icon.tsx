import { RenderNodeProps } from "@litdoc/render";
import { FaIcon, View } from "@litdoc/ui";

export function Icon(props: RenderNodeProps<"Icon">) {
  const { attributes, children, node } = props;

  return (
    <View
      tag="span"
      {...attributes}
      contentEditable={false}
    >
      <FaIcon name={node.name} />
      {children}
    </View>
  );
}
