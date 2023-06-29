import { RenderLeafProps } from "slate-react";
import { ViewNode } from "../../theme/mod.ts";
import { withEditor } from "./with_editor.ts";

export function withLeafRenderer(
  fn: (props: RenderLeafProps, next: () => ViewNode) => ViewNode,
) {
  const editor = withEditor();
  const { renderLeaf } = editor;

  editor.renderLeaf = (props) => {
    return fn(props, () => renderLeaf(props));
  };

  return editor;
}
