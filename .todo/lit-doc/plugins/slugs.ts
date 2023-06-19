import { snakeCase } from "https://esm.sh/tiny-case@1.0.3";
import { Node } from "../types.ts";

function getText(node: Node) {
  return node.children
    .map((child) => {
      if (child.type === "Text") {
        return child.value;
      }
      return "";
    }).join("");
}

export function slugs() {
  return function (node: Node) {
    if (node.type !== "Heading") return;
    node.id = snakeCase(getText(node));
  };
}
