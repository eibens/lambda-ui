import { View } from "@litdoc/ui";

export function Tag(props: {
  text: string;
  color?: string;
}) {
  return (
    <View
      tag="span"
      class={[
        "px-1 flex items-center",
        "rounded",
        "font-sans",
        "text-xs",
        "whitespace-nowrap",
        "text-white",
        `color-${props.color ?? "gray"}`,
        "stroke-50 fill-10 border-1",
      ]}
    >
      {props.text}
    </View>
  );
}
