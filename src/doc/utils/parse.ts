import { createEditor } from "slate";
import { plugin } from "./plugin.ts";

/** MAIN **/

export function parse(string: string) {
  const root = JSON.parse(string);
  const editor = createEditor();
  editor.children = root.children;
  return plugin(editor);
}
