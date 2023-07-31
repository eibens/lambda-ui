import { BaseEditor } from "slate";
import type { ReactEditor } from "slate-react";
import * as Plugins from "./plugins/mod.ts";
import { CustomNodeTypes } from "./utils/schema.ts";
export * from "./utils/editor.ts";

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
