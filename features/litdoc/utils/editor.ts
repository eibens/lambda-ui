import * as Templates from "@litdoc/templates";
import { TagsState } from "litdoc/lit";
import { createEditor, Editor, Element, Node, Path, Text } from "slate";
import * as Icons from "./icons.tsx";
import * as Markdown from "./markdown.ts";
import * as Slugs from "./slugs.ts";
import * as Types from "./types.ts";

export type DocModule = {
  doc: () => TagsState;
};

export function create(options: {
  children?: (Element | Text)[];
  values?: Record<string, unknown>;
}) {
  const mixin = {
    type: "Root",
    values: options.values ?? {},
  };

  const editor = Object.assign(
    createEditor(),
    mixin,
  );

  const plugins = [
    Types.plugin(),
    Slugs.plugin(),
  ];

  for (const plugin of plugins) {
    plugin(editor);
  }

  editor.children = options.children ?? [];
  Markdown.replaceAll(editor);
  Icons.replaceAll(editor);

  return editor;
}

export function createFromTags(state: TagsState) {
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

export function createFromManifest(options: {
  path?: string;
  manifest: {
    routes: Record<string, unknown>;
  };
}): Editor | null {
  const { path, manifest } = options;

  const mod = manifest.routes[path as keyof typeof manifest.routes];
  const { doc } = mod as DocModule;

  if (typeof doc !== "function") {
    return null;
  }

  const state = doc();
  return createFromTags(state);
}

export function getTitle(editor: Editor, options: {
  at: Path;
}) {
  const { at } = options;

  const nodes = Editor.nodes(editor, {
    at,
    match: (node) => node.type === "Heading",
  });

  for (const [node] of nodes) {
    return Node.string(node);
  }

  return null;
}

export function getLead(editor: Editor, options: {
  at: Path;
}) {
  const { at } = options;

  const nodes = Editor.nodes(editor, {
    at,
    match: (node) => node.type === "Paragraph",
  });

  for (const [node] of nodes) {
    return Node.string(node);
  }

  return null;
}
