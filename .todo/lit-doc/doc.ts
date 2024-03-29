import { nanoid } from "https://esm.sh/nanoid@4.0.0";
import { default as gfm } from "https://esm.sh/remark-gfm@3.0.1";
import { default as parseRemark } from "https://esm.sh/remark-parse@10.0.1";
import { unified } from "https://esm.sh/unified@10.1.2";
import type { JSX } from "preact";

/** HELPERS **/

type Entry = [Node, Path];

type Path = number[];

type Node = Record<string, unknown> & {
  children?: Node[];
  text?: string;
  type?: string;
};

function fix(props: {
  root: Node;
  path: number[];
  node: Node;
}) {
  const { root, path, node, values } = props;

  // Ignore root node.
  if (path.length === 0) return;

  // All non-text nodes should have children.
  // Children must contain at least one empty text node.
  const isText = typeof node.text === "string";
  const needsChildren = !isText && !Array.isArray(node.children);
  if (needsChildren) {
    node.children = [{ type: "text", text: "" }];
  }

  // Locate parent of current node.
  const parentPath = path.slice(0, -1);
  let parentNode: Node | null = root;
  for (const index of parentPath) {
    if (!parentNode.children) throw new Error("Parent not found.");
    parentNode = parentNode.children[index];
  }

  // Parent node must exist at this point,
  // as the root node is ignored.
  console.assert(parentNode !== null);
  console.assert(Array.isArray(parentNode.children));

  // Markdown parser stores source positions in `position` property.
  // We don't need that, so we delete it.
  delete node.position;

  // In Markdown AST, nodes that contain text are typed as Literal.
  // A Literal has a `value` property that contains the text.
  // Rename the `value` property to `text` for each such node.
  const literal = node as unknown as Record<PropertyKey, unknown>;
  const isLiteral = typeof literal.value === "string";
  if (isLiteral) {
    literal.text = literal.value;
    delete literal.value;
  }

  // HTML nodes may represent slots.
  // Replace the HTML node using the replacement algorithm.
  if (node.type === "html" && node.text) {
    const match = /^<slot id="([^"]+)"\/>$/
      .exec(node.text.trim());
    if (match) {
      const id = match[1];
      const index = path[path.length - 1];
      const siblings = parentNode.children ?? [];

      
      siblings[index] = resolveSlot(id)
    }
  }

  // Recurse into children.
  if (Array.isArray(node.children)) {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const childPath = [...path, i];
      fix({ root, path: childPath, node: child, values });
    }
  }
}

function encode<Props>(value: Value<Props>, id: string, props: Props): string {
  const isEmpty = value === undefined ||
    value === null ||
    value === false ||
    value === true;

  if (isEmpty) return "";

  if (typeof value === "function") {
    const result = value(props, id);
    return encode(result, id, props);
  }

  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return value.map((value) => encode(value, id, props)).join("");
    }

  }

  return String(value);
}

function doc<Props>() {
  const strings: string[] = [];
  const slots: Record<string, unknown> = {};

  for (const template of templates) {
    const { strings, values } = template;

    const parts: string[] = [];

    for (let i = 0; i < strings.length; i++) {
      parts.push(strings[i]);
      if (i >= values.length) continue;

      const id = nanoid();
      slots[id] = values[i];
      const code = encode(values[i], id, props);
      parts.push(code);
    }

    strings.push(parts.join(""));
  }

  const text = strings.join("");

  const root = unified()
    .use(parseRemark)
    .use(gfm)
    .parse(text) as Node;

  fix({ root, path: [], node: root });

  return {
    children: root.children ?? [],
    slots,
  };
}

/** MAIN **/

export type Value<Props> =
  // Renders to empty string.
  | undefined
  | null
  | boolean
  // Renders to string.
  | string
  | number
  // Embedded react component.
  | JSX.Element
  // Raw editor node or subtree.
  | Record<string, unknown>
  // Function returning any of the above based on input data.
  | ((props: Props, id: string) => Value<Props>)
  // An array of any of the above.
  | Value<Props>[];

export type TemplateArgs<Props> = [TemplateStringsArray, ...Value<Props>[]];

export type LitRenderResult = {
  children: Node[];
  slots: Record<string, unknown>;
};

export type LitResult<Props> =
  & {
    [k in Exclude<string, "render">]: (...args: TemplateArgs<Props>) => void;
  }
  & {
    doc: (props: Props) => LitRenderResult;
  };

export function lit<Props>() {
  const templates: {
    strings: string[];
    values: Value<Props>[];
  }[] = [];


  return new Proxy({ doc }, {
    get: () => {
      return (...args: TemplateArgs<Props>) => {
        const [first, ...rest] = args;
        templates.push({
          strings: [...first],
          values: rest,
        });
      };
    },
  }) as LitResult<Props>;
}
