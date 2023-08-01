import { Editor, EditorNodesOptions, Node, NodeEntry } from "slate";

export function mapped(
  editor: Editor,
  fn: (entry: NodeEntry) => boolean,
  options?: EditorNodesOptions<Node>,
) {
  const iter = editor.nodes(options);
  const entries = Array.from(iter);
  if (entries.length === 0) return;

  for (const entry of entries) {
    if (fn(entry)) {
      mapped(editor, fn, options);
      return;
    }
  }
}
