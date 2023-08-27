import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";

export function Strong(props: RenderNodeProps<"Strong">) {
  const { attributes, children } = props;
  return (
    <View
      {...attributes}
      tag="strong"
      class="font-serif text-black dark:text-white"
    >
      {children}
    </View>
  );
}
