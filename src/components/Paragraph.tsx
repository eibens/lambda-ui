import { View, ViewProps } from "litdoc/components/View.tsx";

export function Paragraph(props: ViewProps<"p">) {
  return (
    <View
      tag="p"
      class={[
        "text-gray-700 dark:text-gray-300",
        "whitespace-normal",
      ]}
      viewProps={props}
    />
  );
}
