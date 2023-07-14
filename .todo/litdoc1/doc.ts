import { default as gfm } from "https://esm.sh/remark-gfm@3.0.1";
import { default as parseRemark } from "https://esm.sh/remark-parse@10.0.1";
import { unified } from "https://esm.sh/unified@10.1.2";
import { Lit, Value } from "./lit.ts";

type BaseElement = {
  children: Node[];
};

type BaseText = {
  text: string;
};

type Schema = {
  // text
  inlineCode: BaseText;
  plain: BaseText;

  // elements
  blockquote: BaseElement;
  listItem: BaseElement;
  thematicBreak: BaseElement;
  emphasis: BaseElement;
  strong: BaseElement;
  delete: BaseElement;
  paragraph: BaseElement & {
    isLead?: boolean;
  };
  heading: BaseElement & {
    depth: 1 | 2 | 3 | 4 | 5 | 6;
    slug?: string;
  };
  list: BaseElement & {
    ordered?: boolean;
  };
  code: BaseElement & {
    lang?: string;
  };
  link: BaseElement & {
    url: string;
  };
  linkReference: BaseElement & {
    label: string;
    identifier: string;
    referenceType: string;
  };
  space: {
    height: number;
  };
};

type RawNode = {
  type?: string;
  children?: RawNode[];
  text?: string;
  position?: unknown;
};

type EncodeOptions<Props> = {
  lang: string;
  value: Value<Props>;
  id: string;
  props: Props;
};

function encode<Props>(options: EncodeOptions<Props>): string {
  const { value, id, props } = options;

  const isEmpty = value === undefined ||
    value === null ||
    value === false ||
    value === true;

  if (isEmpty) return "";

  if (typeof value === "function") {
    const result = value(props, id);
    return encode({
      ...options,
      value: result,
    });
  }

  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return value.map((value) =>
        encode({
          ...options,
          value,
        })
      ).join("");
    }

    if (options.lang === "md") {
      return `<slot id=${options.id} />`;
    }

    throw new Error(`run-time slots not supported for ${options.lang}`);
  }

  return String(value);
}

function fix(options: {
  root: RawNode;
  node: RawNode;
  path: number[];
}) {
  const { root, path, node } = options;

  // All non-text nodes should have children.
  // Children must contain at least one empty text node.
  const isText = typeof node.text === "string";
  const needsChildren = !isText && !Array.isArray(node.children);
  if (needsChildren) {
    node.children = [{ type: "text", text: "" }];
  }

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
    // Locate parent of current node.
    const parentPath = path.slice(0, -1);
    let parentNode: RawNode = root;
    for (const index of parentPath) {
      if (!parentNode.children) throw new Error("Parent not found.");
      parentNode = parentNode.children[index];
    }

    const match = /^<slot id="([^"]+)"\/>$/
      .exec(node.text.trim());
    if (match) {
      const id = match[1];
      const index = path[path.length - 1];
      const siblings = parentNode.children ?? [];
      siblings[index] = {
        type: "slot",
        text: id,
      };
    }
  }

  // Recurse into children.
  if (Array.isArray(node.children)) {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const childPath = [...path, i];
      fix({
        ...options,
        path: childPath,
        node: child,
      });
    }
  }
}

/** MAIN **/

export type Node<T extends keyof Schema = keyof Schema> = {
  [K in keyof Schema]: {
    type: K;
  } & Schema[K];
}[T];

export type Doc = {
  children: Node[];
  slots: Record<string, Value<unknown>>;
};

export function createDoc<Props>(lit: Lit<Props>, options: {
  props: Props;
}) {
  const { props } = options;

  // Concatenate the whole doc onto a single Markdown string.
  const source = lit.children
    .map((template) => {
      const lang = template.lang;
      const source = template.children
        .map((child) => {
          if (child.type !== "slot") return child.text;
          const value = lit.slots[child.text];
          const id = child.text;
          return encode({ lang, value, id, props });
        })
        .join("")
        .trim();

      return lang === "md" ? source : `~~~${lang}\n${source}\n~~~`;
    })
    .join("\n\n");

  const root = unified()
    .use(parseRemark)
    .use(gfm)
    .parse(source);

  fix({
    root,
    path: [],
    node: root,
  });

  return {
    children: root.children as Node[],
    slots: lit.slots,
  };
}
