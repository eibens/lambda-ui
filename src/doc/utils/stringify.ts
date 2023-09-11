import { Editor } from "slate";
import { Root } from "./schema.ts";

/** MAIN **/

export function stringify(editor: Editor) {
  const root: Root = {
    type: "Root",
    children: editor.children,
  };
  return JSON.stringify(root, null, 2);
}
