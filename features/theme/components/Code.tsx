import { RenderNodeProps } from "@litdoc/render";
import { Code as CodeView } from "@litdoc/ui";
import { ReactEditor, useSlate } from "slate-react";
import { Block } from "./Block.tsx";

export function Code(props: RenderNodeProps<"Code">) {
  const { children, node } = props;

  const editor = useSlate();
  const path = ReactEditor.findPath(editor, node);
  const value = editor.string(path, { voids: true });

  return (
    <Block {...props}>
      <CodeView
        lang={node.lang}
        value={value}
        readOnly
      />
      {children}
    </Block>
  );
}
