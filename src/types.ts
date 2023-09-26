import type { VNode } from "preact";
import type { BaseEditor } from "slate";
import type { Program } from "./assets/swc/deno_swc.ts";

/** HELPERS **/

type ToNodeMap<PropMap> = {
  [K in keyof PropMap]: {
    type: K;
  } & PropMap[K];
};

type ToElementMap<NodeMap> = {
  [K in keyof NodeMap]: NodeMap[K] extends {
    children: infer _;
  } ? NodeMap[K]
    : never;
};

type ToTextMap<NodeMap> = {
  [K in keyof NodeMap]: NodeMap[K] extends {
    text: string;
  } ? NodeMap[K]
    : never;
};

type ToCustomNodeTypes<NodeMap> = {
  Node: Nodes<NodeMap>;
  Element: Nodes<ToElementMap<NodeMap>>;
  Text: Nodes<ToTextMap<NodeMap>>;
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

export type { Program } from "./assets/swc/deno_swc.ts";

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

export type Async<T> = Promise<T> | T;

export type Nodes<NodeMap> = NodeMap[keyof NodeMap];

export type NodeType<T extends keyof NodeMap = keyof NodeMap> = T;

export type Node<T extends NodeType = NodeType> = NodeMap[T];

export type Path = number[];

export type NodeEntry<T extends Node = Node> = [T, Path];

export type Root = Node<"Root">;

export type Fragment = Node<"Fragment">;

export type LitdocEditor = BaseEditor & Root & {
  values: Record<string, Value>;
};

export type ToCustomTypes<Editor> = ToCustomNodeTypes<NodeMap> & {
  Editor: Editor;
};

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

export type Template = [
  strings: string[],
  ...values: Value[],
];

export type Call = {
  type: "Call";
  name: string;
  args: Template;
};

export type Manifest = {
  baseUrl?: string;
  routes?: Record<string, unknown>;
  assets?: Record<string, unknown>;
  calls?: Call[];
};

export type Doc =
  & (() => Manifest)
  & {
    [key: string]: (
      strings: TemplateStringsArray,
      ...values: Value[]
    ) => Call;
  };

export type Litdoc = {
  doc: () => Manifest;
};

export type Page = {
  title?: string;
  icon?: string;
  color?: string;
  description?: string;
  breadcrumbs: string[];
  relations: Route[];
};

export type File = {
  key: string;
  version: string;
  text: string;
};

export type Bundle = {
  files: Record<string, File>;
  programs: Record<string, Program>;
  templates: Record<string, string>;
  roots: Record<string, Root>;
  pages: Record<string, Page>;
};

export type Ref = {
  key: string;
  version: unknown;
};

export type Memory<T> = Record<PropertyKey, never> | {
  loaded: true;
  value: Promise<T>;
};

export type MemoryMap<T> = Record<string, {
  version: unknown;
  promise: Promise<T>;
}>;

export type SyncMemoryMap<T> = Record<string, {
  version: unknown;
  value: T;
}>;

export type BinaryCache = {
  storage: "memory" | "disk";
  file: string;
  memory: Memory<Uint8Array>;
  decompress?: (bytes: Uint8Array) => Async<Uint8Array>;
};

export type CacheMap<T> = {
  storage: "memory" | "disk";
  extension: string;
  prefix: string;
  postfix?: string;
  memory: MemoryMap<T>;
  parse: (text: string) => T;
  stringify: (value: T) => string;
};

export type Kernel = {
  main: Manifest;
  manifests: Record<string, Manifest>;
  files: MemoryMap<File>;
  programs: CacheMap<Program>;
  templates: CacheMap<string>;
  roots: CacheMap<Root>;
  pages: CacheMap<Page>;
  swc: BinaryCache;
  swcWasmUrl: URL;
};

export type Route = {
  key: string;
  path: string;
  values: Record<string, Value>;
};

export type TokenData = {
  href: string;
  path: string[];
  params: URLSearchParams;
};
