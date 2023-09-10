import { ReactEditor, RenderNodeProps, useSlate, View } from "./deps.ts";

export function Html(props: RenderNodeProps<"Html">) {
  const { node, attributes, children } = props;
  const editor = useSlate();
  const path = ReactEditor.findPath(editor, node);
  const isInline = editor.isInline(node);
  const value = editor.string(path, { voids: true });

  if (isInline) {
    return (
      <span
        {...attributes}
        dangerouslySetInnerHTML={{ __html: value }}
        contentEditable={false}
      />
    );
  }

  return (
    <View {...attributes} contentEditable={false}>
      <div dangerouslySetInnerHTML={{ __html: value }} />
      {children}
    </View>
  );
}
