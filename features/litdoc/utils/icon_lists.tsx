import { Editor, NodeEntry } from "slate";
import { mapped } from "./mapped.ts";
import * as Override from "./override.ts";

/** MAIN **/

export function replace(editor: Editor, entry: NodeEntry) {
  const [node, path] = entry;

  // Check for a list item node without an icon.
  if (node.type !== "ListItem") return false;
  if (node.icon != null) return false;

  const p0 = [...path, 0, 0];
  const p1 = [...path, 0, 1];
  const p2 = [...path, 0, 2];

  const [n0] = editor.node(p0);
  if (n0 == null) return false;
  if (n0.type !== "Text") return false;
  if (n0.text !== "") return false;
  const [n1] = editor.node(p1);

  if (n1 == null) return false;
  if (n1.type !== "Icon") return false;

  const [n2] = editor.node(p2);
  if (!n2) return false;
  if (n2.type !== "Text") return false;

  // Trim white space from the following text node.
  const text = n2.text;
  const distance = text.length - text.trimStart().length;
  editor.delete({
    at: {
      anchor: {
        path: p0,
        offset: 0,
      },
      focus: {
        path: p2,
        offset: distance,
      },
    },
  });

  // Set the icon name on the list item.
  editor.setNodes({
    icon: n1.name,
  }, {
    at: path,
  });

  return true;
}

export function replaceAll(editor: Editor) {
  mapped(editor, (entry) => replace(editor, entry), {
    at: [],
    match: (x) => x.type === "ListItem",
  });
}

export function plugin() {
  return (editor: Editor) => {
    const override = Override.create({
      normalizeNode: (entry, next) => {
        if (!replace(editor, entry)) next();
      },
    });

    return override(editor);
  };
}
