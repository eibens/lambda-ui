import { BaseEditor } from "slate";
import type { ReactEditor } from "slate-react";
import { ToCustomTypes } from "./utils/schema.ts";
export * as LitdocEditor from "./utils/editor.ts";
export * as Markdown from "./utils/markdown.ts";
export * as Manifest from "./utils/manifest.ts";

declare module "slate" {
  // deno-lint-ignore no-empty-interface
  interface CustomTypes extends
    ToCustomTypes<
      & ReactEditor
      & BaseEditor
    > {}
}
