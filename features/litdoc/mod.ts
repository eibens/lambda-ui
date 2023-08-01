import { BaseEditor } from "slate";
import type { ReactEditor } from "slate-react";
import { CustomNodeTypes } from "./utils/schema.ts";
export * as LitdocEditor from "./utils/editor.ts";
export * as Markdown from "./utils/markdown.ts";

declare module "slate" {
  interface CustomTypes extends CustomNodeTypes {
    Editor:
      & { type: "Root" }
      & { values: Record<string, unknown> }
      & ReactEditor
      & BaseEditor;
  }
}
