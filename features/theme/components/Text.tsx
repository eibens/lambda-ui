import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";

export function Text(props: RenderNodeProps<"Text">) {
  const { attributes, children } = props;
  return (
    <View
      tag="span"
      {...attributes}
      // Needed for
      // - icon font alignment (specifically material icons)
      // - reducing gap to bottom border for faux underline
      class="align-middle"
    >
      {children}
    </View>
  );
}
