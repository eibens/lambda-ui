import { PageProps } from "$fresh/server.ts";
import { Context, Markdown, withBasicTheme } from "@/features/lit-doc/mod.ts";
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

  let normalized = false;

  return {
    md: Markdown.create(editor),
    getEditor: () => {
      if (!normalized) {
        normalized = true;
        editor.children = [{
          type: "root",
          children: editor.children,
        }];
        editor.normalize({ force: true });
      }

      return editor;
    },
  };
}
