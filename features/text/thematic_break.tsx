import { View, ViewProps } from "./view.tsx";

/** MAIN **/

export function ThematicBreak(props: ViewProps<"hr">) {
  return (
    <View
      tag="hr"
      viewProps={props}
      class="border-gray-300 dark:border-gray-700"
    />
  );
}
