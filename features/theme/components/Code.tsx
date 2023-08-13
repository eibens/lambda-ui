import { RenderNodeProps } from "@litdoc/render";
import { Code as CodeView, View } from "@litdoc/ui";
import { ReactEditor, useSlate } from "slate-react";
import { Block } from "./Block.tsx";

export function Code(props: RenderNodeProps<"Code">) {
  const { children, node, attributes } = props;

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
