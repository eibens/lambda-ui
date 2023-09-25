import { View, ViewProps } from "./View.tsx";

export function Blockquote(props: ViewProps<"blockquote">) {
  return (
    <View
      tag="blockquote"
      viewProps={props}
      class={[
        "flex flex-col p-4",
        "rounded-xl",
        "color-gray stroke-10 fill-0 border-4",
      ]}
    />
  );
}
