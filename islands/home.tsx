import { routeFeature } from "@/islands/feature.tsx";
import { createLitdocRenderers, lit, withLitdoc } from "litdoc";
import { createEditor, Node } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { MonacoProvider } from "../features/monaco/mod.ts";

/** HELPERS **/

const { md, doc } = lit<HomeProps>();

md`
# :shape-hexagon: [Lambda UI](#lambda-ui)

This is Lukas Eibensteiner's personal UI library.
It is built for TypeScript, Preact, and Deno.

> Until further notice, this is a proprietary library.

## [Features](#features)

The \`features\` folders export the API of the library.
The following features are available:

---

${function (props, _) {
  return props.features
    .map(routeFeature)
    .flatMap((entry) => {
      if (!entry) return null;
      const [doc, path] = entry;
      const sub = doc({ path });
      const [first, second] = sub.children;

      let heading: Node | undefined;
      let paragraph: Node | undefined;

      if (first.type === "heading") {
        first.depth = 3;
        heading = first;
      }

      if (second.type === "paragraph") {
        paragraph = second;
      }

      return {
        type: "blockquote",
        children: [
          heading,
          ...(paragraph ? [paragraph] : []),
        ],
      };
    })
    .filter(Boolean)
    .map((child) => child as Node);
}}
`;

/** MAIN **/

export type HomeProps = {
  features: string[];
};

export default function Home(props: HomeProps) {
  const editor = withReact(withLitdoc(createEditor()));
  editor.addTemplate(doc(props));
  editor.normalize({ force: true });
  const { renderElement, renderLeaf } = createLitdocRenderers();

  return (
    <MonacoProvider>
      <Slate
        editor={editor}
        initialValue={editor.children}
      >
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          readOnly
        />
      </Slate>
    </MonacoProvider>
  );
}
