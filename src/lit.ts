import type { VNode } from "preact";

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

export type Value =
  | string
  | number
  | boolean
  | null
  | undefined
  | Litdoc
  | Call
  | Call[]
  | Node
  | Node[]
  | VNode;

export type TemplateArgs = [
  strings: string[],
  ...values: Value[],
];

export type Call = {
  type: "Call";
  name: string;
  args: TemplateArgs;
};

export type Lit =
  & (() => Manifest)
  & {
    [key: string]: (
      strings: TemplateStringsArray,
      ...values: Value[]
    ) => Call;
  };

export type Manifest = {
  baseUrl?: string;
  calls: Call[];
  assets: Record<string, unknown>;
  routes: Record<string, unknown>;
};

export type Litdoc = {
  doc: () => Partial<Manifest>;
};

export default function lit(config: Partial<Manifest> = {}): Lit {
  const calls: Call[] = [];

  const doc = (): Manifest => {
    return {
      assets: {},
      routes: {},
      calls,
      ...config,
    };
  };

  const proxy = new Proxy(doc, {
    get: (_, name) => {
      return (...args: TemplateArgs) => {
        const call: Call = {
          type: "Call",
          name: String(name),
          args,
        };
        calls.push(call);
        return call;
      };
    },
  });

  return proxy as Lit;
}
