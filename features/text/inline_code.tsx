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
        "rounded-md p-1",
        "shadow-sm border-1 border-gray-300 dark:border-gray-700",
      ]}
      style={{
        fontSize: "85%",
      }}
    />
  );
}
