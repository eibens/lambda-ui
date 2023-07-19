import { ToCustomTypes, ToNode, ToNodeMap } from "@/features/litdoc/types.ts";
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
  children: ToNode<NodeMap>[];
};

type NodeMap = ToNodeMap<{
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
  icon: BaseElementProps & {
    name: string;
  };
}>;

function isInline(node: Node): boolean {
  if (node.type === "slot" && node.isInline) return true;
  return [
    "emphasis",
    "strong",
    "link",
    "linkReference",
    "inlineCode",
    "delete",
    "icon",
  ].includes(node.type);
}

function isVoid(node: Node): boolean {
  return [
    "slot",
    "hr",
    "code",
    "icon",
  ].includes(node.type);
}

type LitEditor =
  & NodeMap["root"]
  & Plugins.Keys.Mixin
  & Plugins.Types.Mixin
  & Plugins.Templates.Mixin
  & BaseEditor;

/** MAIN **/

declare module "slate" {
  interface CustomTypes extends ToCustomTypes<NodeMap> {
    Editor: LitEditor;
  }
}

export function create() {
  return (editor: Editor) => {
    const plugins = [
      Plugins.Override.create({
        isInline,
        isVoid,
      }),
      Plugins.Keys.create(),
      Plugins.Types.create(),
      Plugins.Icons.create(),
      Plugins.Slugs.create(),
      Plugins.Templates.create(),
    ];

    for (const plugin of plugins) {
      plugin(editor);
    }

    return editor;
  };
}