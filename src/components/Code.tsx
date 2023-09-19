import { View, ViewProps } from "litdoc/components/View.tsx";

export function Code(props: ViewProps) {
  const { children, ...rest } = props;

  return (
    <View
      tag="pre"
      viewProps={rest}
      class={[
        "flex",
        "bg-gray-200 dark:bg-gray-800",
        "font-mono",
        "p-4",
        "rounded-md",
        "leading-6",
        // text should scroll horizontally
        "overflow-x-auto",
      ]}
    >
      <code>
        {children}
      </code>
    </View>
  );
}
