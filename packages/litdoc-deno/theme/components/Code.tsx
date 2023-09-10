import {
  Code as CodeView,
  ReactEditor,
  RenderNodeProps,
  useSlate,
  View,
} from "./deps.ts";

export function Code(props: RenderNodeProps<"Code">) {
  const { children, node, attributes } = props;

  const editor = useSlate();
  const path = ReactEditor.findPath(editor, node);
  const value = editor.string(path, { voids: true });

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
    <View {...attributes}>
      <CodeView
        lang={node.lang}
        value={value}
        readOnly
      />
      {children}
    </View>
  );
}
