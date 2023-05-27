import { nanoid } from "https://esm.sh/nanoid@4.0.0";
import { default as gfm } from "https://esm.sh/remark-gfm@3.0.1";
import { default as parseRemark } from "https://esm.sh/remark-parse@10.0.1";
import { snakeCase } from "https://esm.sh/tiny-case@1.0.3";
import { unified } from "https://esm.sh/unified@10.1.2";
import { BlockNode, Node } from "./types.ts";

/** HELPERS **/

function stringifyTemplate<V>(options: {
  strings: string[];
  values: unknown[];
}) {
  const { strings, values } = options;

  const slots: Record<string, V> = {};

  const source = strings.reduce((acc, part, i) => {
    let value = values[i - 1] ?? "";

    if (typeof value === "object" && value !== null) {
      const id = nanoid();
      slots[id] = value as V;
      value = `<slot id="${id}"/>`;
    }

    return `${acc}${value}${part}`;
  }, "");

  return {
    source,
    slots,
  };
}

function parseTemplate<V>(options: {
  source: string;
  slots: Record<string, V>;
}): Node<"Root"> {
  const { source, slots } = options;

  const root = unified()
    .use(parseRemark)
    .use(gfm)
    .parse(source) as Node<"Root">;

  let index = 0;

  const blocks: BlockNode[] = root.children.map((child) => {
    const block: BlockNode = {
      ...child as BlockNode,
      blockIndex: index++,
    };

    // Mark HTML blocks.
    if (block.type === "html") {
      block.block = true;

      // replace HTML used for VDOM slots
      const match = /^<slot id="([^"]+)"\/>$/.exec(block.value.trim());
      if (match) {
        const id = match[1];
        const slot = slots[id];
        return {
          id,
          type: "Slot",
          value: slot,
        };
      }

      return block;
    }

    // Add IDs to headings.
    if (block.type === "heading") {
      const text = block.children.map((child) => {
        if (child.type === "text") {
          return child.value;
        }
        return "";
      }).join("");
      const id = snakeCase(text);
      block.id = id;
    }

    return block;
  });

  return {
    ...root,
    blocks,
  };
}

/** MAIN **/

export function md(
  strings: TemplateStringsArray | string[],
  ...values: unknown[]
) {
  return parseTemplate(stringifyTemplate({
    strings: [...strings],
    values,
  }));
}
