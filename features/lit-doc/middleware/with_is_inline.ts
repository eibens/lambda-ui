import { Element } from "slate";
import { withEditor } from "./with_editor.ts";

export function withIsInline(fn: (element: Element) => boolean) {
  const editor = withEditor();
  const { isInline } = editor;

  editor.isInline = (element) => {
    return fn(element) || isInline(element);
  };
}
