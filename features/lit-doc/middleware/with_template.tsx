import { LitDoc } from "../types.ts";
import { withEditor } from "./with_editor.ts";

export function withTemplate(template: LitDoc) {
  const { children, slots } = template;
  const editor = withEditor();
  editor.children = [{ type: "root", children }];
  Object.assign(editor.slots, slots);
}
