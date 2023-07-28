import { RenderNodeProps } from "@litdoc/render";
import { Icon as IconView, View } from "@litdoc/ui";

export function Icon(props: RenderNodeProps<"Icon">) {
  const { attributes, children, node } = props;
  return (
    <View tag="span" {...attributes}>
      <IconView
        name={node.name}
      />
      {children}
    </View>
  );
}
