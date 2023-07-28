import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";

export function InlineCode(props: RenderNodeProps<"InlineCode">) {
  const { attributes, children } = props;
  return (
    <View
      {...attributes}
      tag="code"
      viewProps={props}
      class={[
        "font-mono",
        "hover:border-black dark:hover:border-white",
        "transition-colors duration-200 ease-in-out",
      ]}
    >
      {children}
    </View>
  );
}
