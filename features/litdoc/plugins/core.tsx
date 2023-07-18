import { BaseEditor, Editor, Node } from "slate";
import * as Plugins from "./mod.ts";

/** HELPERS **/

type BaseNodeProps = {
  key?: string;
};

type BaseLeafProps = BaseNodeProps & {
  text: string;
};

type BaseElementProps = BaseNodeProps & {
  // Cannot use Node here because it is circular
  children: ToNode<NodeMap<PropMap>>[];
};

type PropMap = {
  root: BaseElementProps;
  plain: BaseLeafProps;
  paragraph: BaseElementProps;
  heading: BaseElementProps & {
    depth: 1 | 2 | 3 | 4 | 5 | 6;
    slug?: string;
  };
  blockquote: BaseElementProps;
  list: BaseElementProps & {
    ordered?: boolean;
  };
  listItem: BaseElementProps;
  slot: BaseElementProps & {
    id: string;
    isInline?: boolean;
  };
  code: BaseElementProps & {
    lang?: string;
  };
  thematicBreak: BaseElementProps;
  inlineCode: BaseLeafProps;
  link: BaseElementProps & {
    url: string;
  };
  linkReference: BaseElementProps & {
    label: string;
    identifier: string;
    referenceType: string;
  };
  emphasis: BaseElementProps;
  strong: BaseElementProps;
  delete: BaseElementProps;
};

type NodeMap<PropMap> = {
  [K in keyof PropMap]: {
    type: K;
  } & PropMap[K];
};

type ElementMap<NodeMap> = {
  [K in keyof NodeMap]: NodeMap[K] extends {
    children: infer _;
  } ? NodeMap[K]
    : never;
};

type TextMap<NodeMap> = {
  [K in keyof NodeMap]: NodeMap[K] extends {
    text: string;
  } ? NodeMap[K]
    : never;
};

type CustomSlateTypes<NodeMap> = {
  Element: ElementMap<NodeMap>[keyof ElementMap<NodeMap>];
  Text: TextMap<NodeMap>[keyof TextMap<NodeMap>];
};

type ToNode<NodeMap> = NodeMap[keyof NodeMap];

function isInline(node: Node): boolean {
  if (node.type === "slot" && node.isInline) return true;
  return [
    "emphasis",
    "strong",
    "link",
    "linkReference",
    "inlineCode",
    "delete",
  ].includes(node.type);
}

function isVoid(node: Node): boolean {
  return [
    "slot",
    "hr",
    "code",
  ].includes(node.type);
}

type LitEditor =
  & PropMap["root"]
  & Plugins.Keys.Mixin
  & Plugins.Types.Mixin
  & Plugins.Templates.Mixin
  & BaseEditor;

/** MAIN **/

declare module "slate" {
  interface CustomTypes extends CustomSlateTypes<NodeMap<PropMap>> {
    Editor: LitEditor;
  }
}

export function create() {
  return (editor: Editor) => {
    const plugins = [
      Plugins.Templates.create(),
      Plugins.Keys.create(),
      Plugins.Types.create(),
      Plugins.Slugs.create(),
      Plugins.Override.create({
        isInline,
        isVoid,
      }),
    ];

    for (const plugin of plugins) {
      plugin(editor);
    }

    return editor;
  };
}
