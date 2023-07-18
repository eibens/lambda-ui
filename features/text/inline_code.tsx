import { View, ViewProps } from "./view.tsx";

/** MAIN **/

export function InlineCode(props: ViewProps<"code">) {
  return (
    <View
      tag="code"
      viewProps={props}
      class={[
        "font-mono",
        "hover:border-black dark:hover:border-white",
        "transition-colors duration-200 ease-in-out",
      ]}
    />
  );
}
