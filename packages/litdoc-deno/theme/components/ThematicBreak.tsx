import { RenderNodeProps, View } from "./deps.ts";

export function ThematicBreak(props: RenderNodeProps<"ThematicBreak">) {
  const { attributes, children } = props;
  return (
    <View {...attributes}>
      <View
        tag="hr"
        class="border-gray-300 dark:border-gray-700"
      />
      {children}
    </View>
  );
}
