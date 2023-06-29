import { Element } from "slate";
import { withEditor } from "./with_editor.ts";

export function withIsVoid(fn: (element: Element) => boolean) {
  const editor = withEditor();
  const { isVoid } = editor;

  editor.isVoid = (element) => {
    return fn(element) || isVoid(element);
  };
}
