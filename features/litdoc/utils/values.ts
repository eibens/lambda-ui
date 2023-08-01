import { Editor, NodeEntry } from "slate";

function stringify(
  value: unknown,
  props?: unknown,
  fallback?: (value: unknown) => string,
): string {
  const recurse = (value: unknown) => stringify(value, props, fallback);
  if (value === undefined) return "";
  if (value === null) return "";
  if (typeof value === "boolean") return "";
  if (typeof value === "number") return value.toString();
  if (typeof value === "string") return value;
  if (typeof value === "function") return recurse(value(props));
  if (Array.isArray(value)) return value.map(recurse).join("");
  if (fallback) return fallback(value);
  return String(value);
}

export function replace(editor: Editor, entry: NodeEntry) {
  const [node, path] = entry;

  if (node.type !== "Value") return false;

  const value = editor.values[node.id];

  const isVdom = value !== null &&
    typeof value === "object" &&
    "$$typeof" in value;
  if (isVdom) return false;

  const text = stringify(value);

  editor.select(path);
  editor.insertNodes([{
    type: "Text",
    text,
  }], { at: path });
  delete editor.values[node.id];
}

export function replaceAll(editor: Editor) {
  const nodes = editor.nodes({
    at: [],
    voids: true,
    match: (node) => node.type === "Value",
  });
  for (const entry of nodes) {
    replace(editor, entry);
  }
}
