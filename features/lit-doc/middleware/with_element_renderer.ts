import { RenderElementProps } from "slate-react";
import { ViewNode } from "../../theme/mod.ts";
import { withEditor } from "./with_editor.ts";

export function withElementRenderer(
  fn: (
    props: RenderElementProps,
    next: (props: RenderElementProps) => ViewNode,
  ) => ViewNode,
) {
  const editor = withEditor();
  const { renderElement } = editor;

  editor.renderElement = (props) => {
    return fn(props, (props) => renderElement(props));
  };

  return editor;
}
