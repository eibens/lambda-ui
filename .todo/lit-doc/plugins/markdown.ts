import { nanoid } from "https://esm.sh/nanoid@4.0.0";
import { default as gfm } from "https://esm.sh/remark-gfm@3.0.1";
import { default as parseRemark } from "https://esm.sh/remark-parse@10.0.1";
import { unified } from "https://esm.sh/unified@10.1.2";
import { Node } from "../types.ts";

/** HELPERS **/

function visit(node: Node, fn: (node: Node) => void) {
  fn(node);
  if (!("children" in node)) return;
  node.children.forEach((child) => visit(child, fn));
}

export function markdown(node: Node) {
  if (node.type !== "Call") return node;
  if (node.name !== "md") return node;

  const [strings, ...values] = node.args as [
    TemplateStringsArray,
    ...unknown[],
  ];

  const slots: Record<string, unknown> = {};

  const source = strings.reduce((acc, part, i) => {
    let value = values[i - 1] ?? "";

    if (typeof value === "object" && value !== null) {
      const id = nanoid();
      slots[id] = value;
      value = `<slot id="${id}"/>`;
    }

    return `${acc}${value}${part}`;
  }, "");

  const root = unified()
    .use(parseRemark)
    .use(gfm)
    .parse(source) as Node;

  visit(root, (node) => {
    match(Html, (node) => {
      // replace HTML used for VDOM slots
      const match = /^<slot id="([^"]+)"\/>$/.exec(node.value.trim());
      if (match) {
        const id = match[1];
        const slot = slots[id];

        const s = node as unknown as Node<"Slot">;
        s.id = id;
        s.type = "Slot";
        s.value = slot;
      }
    })
  });
}
