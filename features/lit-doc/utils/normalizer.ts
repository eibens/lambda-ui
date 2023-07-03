import { LitEditor } from "../types.ts";

const cache = new WeakSet<LitEditor>();

// TODO: All of this is a temporary solution.
// Rather, the editor ops should already work with the root in mind.
// The root is necessary for applying styles to the block list (e.g. gap).
// Normalization itself still needs to happen, but probably somewhere else.
export function create(editor: LitEditor) {
  return () => {
    if (!cache.has(editor)) {
      cache.add(editor);
      editor.children = [{
        type: "root",
        children: editor.children,
      }];
      editor.normalize({ force: true });
    }

    return editor;
  };
}
