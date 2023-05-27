import { View, ViewProps } from "./view.tsx";

/** MAIN **/

export function Blockquote(props: ViewProps<"blockquote">) {
  return (
    <View
      tag="blockquote"
      viewProps={props}
      class={[
        "flex flex-col gap-12 px-4 py-4",
        "rounded shadow-md border-1 border-gray-300 dark:border-gray-700",
      ]}
    />
  );
}
