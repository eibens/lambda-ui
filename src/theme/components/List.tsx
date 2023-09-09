import { getSpacing, RenderNodeProps, useSlate, View } from "./deps.ts";

export function List(props: RenderNodeProps<"List">) {
  const { attributes, children, node } = props;
  const { ordered } = node;
  const tag = ordered ? "ol" : "ul";
  const style = ordered ? "list-decimal" : "list-disc";
  const editor = useSlate();
  const spacing = getSpacing(editor, node);
  return (
    <View
      tag={tag}
      {...attributes}
      class={[
        "flex flex-col",
        style,
      ]}
      style={{
        marginBottom: spacing + "px",
      }}
    >
      {children}
    </View>
  );
}
