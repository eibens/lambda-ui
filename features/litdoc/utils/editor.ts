import * as Templates from "@litdoc/templates";
import { TagsState } from "litdoc/lit";
import { createEditor, Editor, Element, Node, Path, Text } from "slate";
import * as IconLists from "./icon_lists.tsx";
import * as Icons from "./icons.tsx";
import * as Markdown from "./markdown.ts";
import * as Slots from "./slots.ts";
import * as Slugs from "./slugs.ts";
import * as Types from "./types.ts";
import * as Values from "./values.ts";

/** MAIN **/

export function create(options?: {
  children?: (Element | Text)[];
  values?: Record<string, unknown>;
}): Editor {
  const editor = createEditor();

  const mixin = {
    type: "Root",
    values: options?.values ?? {},
    children: options?.children ?? [],
  };

  Object.assign(
    editor,
    mixin,
  );

  const plugins = [
    Types.plugin(),
    Slugs.plugin(),
  ];

  for (const plugin of plugins) {
    plugin(editor);
  }

  Values.replaceAll(editor);
  Markdown.replaceAll(editor);
  Icons.replaceAll(editor);
  Slots.replaceAll(editor);
  IconLists.replaceAll(editor);

  editor.normalize({ force: true });

  return editor;
}

export function createFromTags(state: TagsState): Editor {
  const values = {};
  return create({
    values,
    children: state.flatMap(({ name, args }) => {
      const template = Templates.tagged(...args);
      Object.assign(values, template.values);
      return {
        type: "Code" as const,
        lang: name,
        children: template.children,
      };
    }),
  });
}

export function getTitle(editor: Editor, options?: {
  at?: Path;
}): string | undefined {
  const { at = [] } = options ?? {};

  const nodes = Editor.nodes(editor, {
    at,
    match: (node) => node.type === "Heading",
  });

  for (const [node] of nodes) {
    return Node.string(node).trim();
  }
}

export function getLead(editor: Editor, options?: {
  at?: Path;
}): string | undefined {
  const { at = [] } = options ?? {};

  const nodes = Editor.nodes(editor, {
    at,
    match: (node) => node.type === "Paragraph",
  });

  for (const [node] of nodes) {
    return Node.string(node).trim();
  }
}

export function getIcon(editor: Editor, options?: {
  at?: Path;
}): string | undefined {
  const { at = [] } = options ?? {};

  const nodes = Editor.nodes(editor, {
    at,
    voids: true,
    match: (node) => node.type === "Icon",
  });

  for (const [node] of nodes) {
    if (node.type === "Icon") {
      return node.name;
    }
  }
}
