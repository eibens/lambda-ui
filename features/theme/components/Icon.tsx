import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";

export function Icon(props: RenderNodeProps<"Icon">) {
  const { attributes, children, node } = props;

  return (
    <View
      tag="span"
      {...attributes}
      contentEditable={false}
    >
      <span
        class="material-symbols-outlined"
        style={{
          fontSize: "inherit",
          top: "0.125lh",
          position: "relative",
        }}
      >
        {node.name}
      </span>
      {children}
    </View>
  );
}
