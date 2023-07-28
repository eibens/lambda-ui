import { RenderNodeProps } from "@litdoc/render";
import { ReactEditor, useSlate } from "slate-react";
import { Block } from "./Block.tsx";

export function Html(props: RenderNodeProps<"Html">) {
  const { node, attributes } = props;
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
    <Block {...props}>
      <div dangerouslySetInnerHTML={{ __html: value }} />
    </Block>
  );
}
