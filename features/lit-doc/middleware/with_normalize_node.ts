import { NodeEntry } from "slate";
import { withEditor } from "./with_editor.ts";

/** HELPERS **/

export function withNormalizeNode(
  fn: (entry: NodeEntry, next: () => void) => void,
) {
  const editor = withEditor();
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    fn(entry, () => {
      normalizeNode(entry);
    });
  };
}
