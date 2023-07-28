import { Editor, Node, Transforms } from "slate";
import * as Override from "./override.ts";

/** HELPERS **/

function* parseIcons(str: string): Generator<Node> {
  const iconRegex = /:([-_a-zA-Z0-9]+):/g;

  const text = (text = "") => ({
    type: "Text" as const,
    text,
  });

  const icon = (name: string) => ({
    type: "Icon" as const,
    name,
    children: [text()],
  });

  let lastIndex = 0;
  let match;
  while ((match = iconRegex.exec(str)) !== null) {
    const [_, name] = match;
    yield text(str.slice(lastIndex, match.index));
    yield icon(name);
    lastIndex = iconRegex.lastIndex;
  }
  yield text(str.slice(lastIndex));
}

/** MAIN **/

export function create() {
  return (editor: Editor) => {
    const override = Override.create({
      normalizeNode: (entry, next) => {
        const [node, path] = entry;

        if (node.type !== "Text") return next();

        const text = node.text;
        if (!text.trim()) return next();

        const children = [...parseIcons(text)] as Node[];

        if (children.length === 1) return next();

        Editor.withoutNormalizing(editor, () => {
          Transforms.select(editor, {
            anchor: Editor.start(editor, path),
            focus: Editor.end(editor, path),
          });

          Transforms.insertFragment(editor, children);
        });
      },
    });

    return override(editor);
  };
}
