import { BaseEditor, createEditor, Element, Text } from "slate";
import type { ReactEditor } from "slate-react";
import * as Plugins from "./plugins/mod.ts";
import { CustomNodeTypes } from "./schema.ts";

export { default as dev } from "./dev.ts";
export { default as lit } from "./lit.ts";
export { default as TwindConfig } from "./twind.config.ts";

declare module "slate" {
  interface CustomTypes extends CustomNodeTypes {
    Editor:
      & { type: "Root"; key?: string }
      & ReactEditor
      & Plugins.Keys.Mixin
      & Plugins.Summary.Mixin
      & { values: Record<string, unknown> }
      & BaseEditor;
  }
}

export type Manifest = {
  baseUrl: string;
  routes: Record<string, unknown>;
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
