import { getSpacing, RenderNodeProps, useSlate, View } from "./deps.ts";

export function Code(props: RenderNodeProps<"Code">) {
  const { children, node, attributes } = props;

  const editor = useSlate();
  const spacing = getSpacing(editor, node);

  if (node.isInline) {
    return (
      <View
        {...attributes}
        tag="code"
        class={[
          "font-mono",
          "hover:border-black dark:hover:border-white",
          "transition-colors",
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <View
      tag="code"
      {...attributes}
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
      style={{
        marginBottom: spacing + "px",
      }}
    >
      <pre>
      {children}
      </pre>
    </View>
  );
}
