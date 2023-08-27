import { signal } from "@preact/signals";
import { create, map } from "./slate.ts";

/** HELPERS **/

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

/** MAIN **/

export function replaceAll(
  node: {
    children: unknown[];
  },
  values: Record<string, unknown>,
) {
  const editor = create(node);
  map(editor, {
    at: [],
    voids: true,
    match: (node) => {
      if (node.type !== "Value") return false;

      const value = values[node.id];
      const isVDom = value !== null &&
        typeof value === "object" &&
        "$$typeof" in value;

      if (isVDom) return false;

      return true;
    },
    apply: (entry) => {
      const [node, path] = entry;

      if (node.type !== "Value") return false;

      const value = values[node.id];
      const text = stringify(value);

      editor.insertNodes([{
        type: "Text",
        text,
      }], { at: path });
      editor.removeNodes({ at: path });

      delete values[node.id];

      return true;
    },
  });
}
