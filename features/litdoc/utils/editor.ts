import * as Templates from "@litdoc/templates";
import { TagsState } from "litdoc/lit";
import { createEditor, Element, Text } from "slate";
import * as Plugins from "../plugins/mod.ts";

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
    // Must come first to enable path look ups.
    Plugins.Keys.create(),

    // Add type prop, which is used for normalizations and transforms.
    Plugins.Types.create(),

    // Useful extensions.
    Plugins.Icons.create(),
    Plugins.Slugs.create(),
    Plugins.Summary.create(),
  ];

  for (const plugin of plugins) {
    plugin(editor);
  }

  editor.children = options.children ?? [];
  editor.normalize({ force: true });

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
}) {
  const { path, manifest } = options;

  const mod = manifest.routes[path as keyof typeof manifest.routes];
  const { doc } = mod as DocModule;

  if (typeof doc !== "function") {
    return null;
  }

  const state = doc();
  return createFromTags(state);
}
