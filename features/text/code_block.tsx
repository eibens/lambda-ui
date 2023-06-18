import { View, ViewProps } from "./view.tsx";

/** MAIN **/

export function CodeBlock(props: ViewProps<"pre">) {
  return (
    <View
      tag="pre"
      viewProps={props}
      class={[
        "transition",
        "text-sm font-mono",
        "text-gray-600 dark:text-gray-400",
        "rounded-md p-4",
        "bg-white dark:bg-gray-900",
        "overflow-auto",
        "-mx-4",
      ]}
    />
  );
}
