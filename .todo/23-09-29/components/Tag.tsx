import { View, ViewChildren } from "./View.tsx";

export function Tag(props: {
  text?: string;
  children?: ViewChildren;
  color?: string;
}) {
  return (
    <View
      tag="span"
      class={[
        "px-1",
        "rounded",
        "font-sans",
        "text-white",
        `color-${props.color ?? "gray"}`,
        "stroke-50 fill-10 border-1",
      ]}
    >
      {props.text ?? props.children}
    </View>
  );
}
