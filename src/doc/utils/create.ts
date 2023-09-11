import { createEditor, Editor, Node } from "slate";
import { plugin } from "./plugin.ts";

export function create(options: {
  children: Node[];
  values: Record<string, unknown>;
}): Editor {
  const { children, values } = options;
  const editor = createEditor();
  editor.children = children;
  editor.values = values;
  return plugin(editor);
}
