import { PageProps } from "$fresh/server.ts";
import {
  Context,
  Markdown,
  Normalizer,
  withBasicTheme,
} from "@/features/lit-doc/mod.ts";
import { LitEditor } from "@/features/lit-doc/types.ts";
import { ViewNode } from "@/features/theme/view.tsx";

/** MAIN **/

export type RouteComponent = (props: PageProps) => ViewNode;

export type RenderComponent = (
  props: PageProps & {
    readonly editor: LitEditor;
  },
) => ViewNode;

export function lit() {
  const editor = Context.create(() => {
    withBasicTheme();
  });

  return {
    md: Markdown.create(editor),
    getEditor: Normalizer.create(editor),
  };
}
