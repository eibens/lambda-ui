import { View, ViewProps } from "litdoc/components/View.tsx";

export function InlineCode(props: ViewProps) {
  return (
    <View
      viewProps={props}
      tag="code"
      class={[
        "font-mono",
        "hover:border-black dark:hover:border-white",
        "transition-colors",
      ]}
    />
  );
}
