import { Editor, Node, Transforms } from "slate";
import * as Override from "./override.ts";

function* parseIcons(text: string): Generator<Node> {
  const iconRegex = /:([-_a-zA-Z0-9]+):/g;

  let lastIndex = 0;

  let match;
  while ((match = iconRegex.exec(text)) !== null) {
    const [_, name] = match;

    yield {
      type: "plain",
      text: text.slice(lastIndex, match.index),
    };

    yield {
      type: "icon",
      name,
      children: [
        {
          type: "plain",
          text: "",
        },
      ],
    };

    lastIndex = iconRegex.lastIndex;
  }

  yield {
    type: "plain",
    text: text.slice(lastIndex),
  };
}

export function create() {
  return (editor: Editor) => {
    const override = Override.create({
      normalizeNode: (entry, next) => {
        const [node, path] = entry;

        if (node.type !== "plain") return next();

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
