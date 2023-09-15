import { RenderNodeProps, Tag, View } from "./deps.ts";

export function Unknown(props: RenderNodeProps<"Unknown">) {
  const { attributes, children, node } = props;

  const { type } = node;
  return (
    <View tag="span" {...attributes}>
      <Tag color="red">
        Missing component for <b>{type}</b>
      </Tag>
      {children}
    </View>
  );
}
