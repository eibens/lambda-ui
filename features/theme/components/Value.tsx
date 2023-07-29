import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";
import { useSlate } from "slate-react";
import { Block } from "./Block.tsx";

export function Value(props: RenderNodeProps<"Value">) {
  const { attributes, children, node } = props;

  const { id } = node;
  const editor = useSlate();
  const value = editor.values[id];
  const isInline = editor.isInline(node);

  const content = (
    <>
      <View
        tag={isInline ? "span" : "div"}
        contentEditable={false}
        // See https://github.com/ianstormtaylor/slate/issues/3425#issuecomment-575436724
        // This prevents error when focusing a Monaco Editor.
        // But it does not prevent error when blurring.
        data-slate-editor
      >
        <>{value}</>
      </View>
      {children}
    </>
  );

  if (isInline) {
    return (
      <View
        {...attributes}
        tag="span"
      >
        {content}
      </View>
    );
  }

  return (
    <Block {...props} contentEditable={false}>
      {content}
    </Block>
  );
}
