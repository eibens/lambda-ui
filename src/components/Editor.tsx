import { Editor as EditorType, Node } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { ViewChildren } from "./View.tsx";

/** MAIN **/

export type EditorNodeProps<T extends Node["type"] = Node["type"]> = {
  attributes: Record<string, unknown>;
  children: ViewChildren;
  node: Extract<Node, { type: T }>;
};

export type EditorProps = {
  editor: EditorType;
  render: (props: EditorNodeProps) => JSX.Element;
};

export function Editor(props: EditorProps) {
  const { editor, render } = props;
  return (
    <Slate
      editor={withReact(editor)}
      initialValue={editor.children}
    >
      <Editable
        // @ts-ignore must be string to work
        spellCheck="false"
        readOnly
        renderElement={({ element, ...rest }) =>
          render({
            ...rest,
            node: element,
          })}
        renderLeaf={({ leaf, ...rest }) =>
          render({
            ...rest,
            node: leaf,
          })}
      />
    </Slate>
  );
}
