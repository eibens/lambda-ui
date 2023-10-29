import { View, ViewProps } from "./View.tsx";

export function ThematicBreak(
  props: ViewProps,
) {
  return (
    <View
      tag="hr"
      viewProps={props}
      class="border-gray-300 dark:border-gray-700"
    />
  );
}
