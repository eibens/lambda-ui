import gfm from "https://esm.sh/remark-gfm@3.0.1";
import parseRemark from "https://esm.sh/remark-parse@10.0.1";
import { unified } from "https://esm.sh/unified@10.1.2";
import type { Call, Value } from "./lit.ts";

/** HELPERS **/

type ToNodeMap<PropMap> = {
  [K in keyof PropMap]: {
    type: K;
  } & PropMap[K];
};

type BaseNodeProps = {
  tokens?: string[];
};

type BaseLeafProps = BaseNodeProps & {
  text: string;
};

type BaseElementProps = BaseNodeProps & {
  // Cannot use Node here because it is circular
  children: NodeMap[keyof NodeMap][];
};

type BaseInlineBlockProps = BaseElementProps & {
  isInline?: boolean;
};

function fromMdast(node: Record<string, unknown>): Node[] {
  // Right now, we are not using the position data.
  delete node.position;

  // from lowerCamelCase to UpperCamelCase
  const type = node.type as string;
  node.type = type.replace(/^[a-z]/, (c) => c.toUpperCase());

  // In Markdown AST, nodes that contain text are typed as Literal.
  // A Literal has a `value` property that contains the text.
  const isLiteral = typeof node.value === "string";
  if (isLiteral) {
    // Rename the `value` property to `text` for each such node.
    node.text = node.value;
    delete node.value;
  }

  // Convert markdown code nodes to Code elements.
  if (node.type === "InlineCode" || node.type === "Code") {
    node.isInline = node.type === "InlineCode";
    node.type = "Code";
    node.children = [{ type: "Text", text: node.text }];
    delete node.text;
  }

  // Some nodes in Markdown AST have no children.
  // These need an empty text element for Slate compatibility.
  // Ignore elements with child array.
  const hasChildren = "children" in node;
  const isText = typeof node.text === "string";
  if (!hasChildren && !isText) {
    node.children = [{ type: "Text", text: "" }];
  }

  // Parse tokens in text nodes.
  if (node.type === "Text") {
    const text = node.text as string;
    return Array.from(parseTokens(text));
  }

  // Recurse into child nodes.
  if (Array.isArray(node.children)) {
    const list = node.children.flatMap(fromMdast);
    node.children = list;
  }

  return [node as Node];
}

function* parseTokens(str: string): Generator<Node> {
  const createText = (text = ""): Node => ({
    type: "Text",
    text,
  });

  const pattern = /:([^:\s]+):/g;

  let lastIndex = 0;
  let match;
  while ((match = pattern.exec(str)) !== null) {
    const [_, data] = match;
    const before = str.slice(lastIndex, match.index);
    if (before) yield createText(before);

    const children = [createText()];
    const getUrl = (text: string) => new URL(`token:///${text}`).toString();
    if (data.startsWith("^")) {
      yield {
        type: "Token",
        assign: "before" as const,
        url: getUrl(data.slice(1)),
        children,
      };
    } else if (data.endsWith("^")) {
      yield {
        type: "Token",
        assign: "after" as const,
        url: getUrl(data.slice(0, -1)),
        children,
      };
    } else {
      yield {
        type: "Token",
        url: getUrl(data),
        children,
      };
    }

    lastIndex = pattern.lastIndex;
  }
  const after = str.slice(lastIndex);
  if (after) yield createText(after);
}

/** MAIN **/

export type NodeMap = ToNodeMap<{
  Root: BaseElementProps;
  Fragment: BaseElementProps;

  // Leaf nodes
  Text: BaseLeafProps;

  // Inline Blocks
  // Can be marked either as inline or block element.
  // Determined by type of parent.
  Html: BaseInlineBlockProps;
  Code: BaseInlineBlockProps & {
    lang?: string;
  };
  Link: BaseInlineBlockProps & {
    url: string;
  };
  Unknown: BaseInlineBlockProps;

  // Blocks
  Paragraph: BaseElementProps;
  Blockquote: BaseElementProps;
  Heading: BaseElementProps & {
    depth: 1 | 2 | 3 | 4 | 5 | 6;
  };
  List: BaseElementProps & {
    ordered?: boolean;
  };
  ListItem: BaseElementProps & {
    icon?: string;
  };
  Image: BaseElementProps & {
    url: string;
    title?: string;
    alt?: string;
  };
  ThematicBreak: BaseElementProps;
  LinkReference: BaseElementProps & {
    label: string;
    identifier: string;
    referenceType: string;
  };
  FootnoteReference: BaseElementProps & {
    identifier: string;
    label?: string;
  };

  // Inline
  Emphasis: BaseElementProps;
  Strong: BaseElementProps;
  Delete: BaseElementProps;
  Break: BaseElementProps;
  Token: BaseElementProps & {
    url: string;
    assign?: "before" | "after";
  };
}>;

export type Nodes<NodeMap> = NodeMap[keyof NodeMap];

export type NodeType<T extends keyof NodeMap = keyof NodeMap> = T;

export type Node<T extends NodeType = NodeType> = NodeMap[T];

export type Root = Node<"Root">;

export type Fragment = Node<"Fragment">;

export function md(strings: TemplateStringsArray, ...values: Value[]): Call {
  return {
    type: "Call",
    name: "md",
    args: [[...strings], ...values],
  };
}

export function mdi(
  strings: TemplateStringsArray,
  ...values: Value[]
): Call {
  return {
    type: "Call",
    name: "mdi",
    args: [[...strings], ...values],
  };
}

export function parse(str: string, options: {
  fragment?: boolean;
} = {}): Root {
  const parsed = unified()
    .use(parseRemark)
    .use(gfm)
    .parse(str);

  const nodes = fromMdast(parsed as unknown as Record<string, unknown>);
  const root = nodes[0] as Root;
  return root;
}

export function parseFragment(str: string): Fragment {
  const root = parse(str);

  if (root.children.length > 1) {
    throw new Error(
      "Inline markdown must not contain multiple blocks. Single paragraph expected.",
    );
  }

  const [child] = root.children;
  if (child.type !== "Paragraph") {
    throw new Error(
      `Inline markdown must be a paragraph. Got ${child.type}.`,
    );
  }

  return {
    type: "Fragment",
    children: child.children,
  };
}

export function code(text: string, lang: string): Root {
  return {
    type: "Root",
    children: [{
      type: "Code",
      lang,
      children: [{ type: "Text", text }],
    }],
  };
}
