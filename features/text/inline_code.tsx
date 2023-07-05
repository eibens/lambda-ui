import { View, ViewProps } from "./view.tsx";

/** MAIN **/

export function InlineCode(props: ViewProps<"code">) {
  return (
    <View
      tag="code"
      viewProps={props}
      class={[
        "font-mono",
        "text-gray-600 dark:text-gray-400",
        "color-teal fill-0",
      ]}
    />
  );
}
