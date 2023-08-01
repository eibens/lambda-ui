import { Editor, Node, NodeEntry } from "slate";
import * as Override from "./override.ts";

/** MAIN **/

export function parse(str: string): Node[] {
  function* generator(str: string): Generator<Node> {
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

  return [...generator(str)];
}

export function replace(editor: Editor, entry: NodeEntry) {
  const [node, path] = entry;

  if (node.type !== "Text") return false;

  const children = parse(node.text);
  if (children.length === 1) return false;

  editor.removeNodes({ at: path });
  editor.insertNodes(children, { at: path });

  return true;
}

export function replaceAll(editor: Editor) {
  const nodes = editor.nodes({
    at: [],
    match: (x) => x.type === "Text",
  });

  for (const entry of nodes) {
    replace(editor, entry);
  }
}

export function getNames(editor: Editor) {
  const icons = new Set<string>();

  const nodes = editor.nodes({
    at: [],
    match: (x) => x.type === "Icon",
  });

  for (const entry of nodes) {
    const [node] = entry;
    if (node.type !== "Icon") continue;
    icons.add(node.name);
  }

  return icons;
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
