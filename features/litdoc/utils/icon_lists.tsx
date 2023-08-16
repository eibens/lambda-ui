import { Editor, NodeEntry } from "slate";
import { mapped } from "./mapped.ts";
import * as Override from "./override.ts";

/** MAIN **/

export function replace(editor: Editor, entry: NodeEntry) {
  const [node, path] = entry;

  // Check for a list item node without an icon.
  if (node.type !== "ListItem") return false;
  if (node.icon != null) return false;

  // Check for an empty text node at [..., 0, 0]
  const textPath = [...path, 0, 0];
  const [textNode] = Editor.node(editor, textPath);
  if (textNode == null) return false;
  if (textNode.type !== "Text") return false;
  if (textNode.text !== "") return false;

  // Check for an icon node at [..., 0, 1]
  const iconPath = [...path, 0, 1];
  const [iconNode] = Editor.node(editor, iconPath);
  if (iconNode == null) return false;
  if (iconNode.type !== "Icon") return false;

  // Remove the icon node from the list item.
  editor.removeNodes({ at: iconPath });

  // Set the icon name on the list item.
  editor.setNodes({
    icon: iconNode.name,
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
