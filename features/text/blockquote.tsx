import { View, ViewProps } from "./view.tsx";

/** MAIN **/

export function Blockquote(props: ViewProps<"blockquote">) {
  return (
    <View
      tag="blockquote"
      viewProps={props}
      class={[
        "flex flex-col gap-12 px-4 py-4",
        "rounded-lg shadow-md color-gray fill-10",
      ]}
    />
  );
}
