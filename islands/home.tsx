import { createLitdocRenderers, lit, withLitdoc } from "litdoc";
import { createEditor } from "slate";
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

${function (props) {
  return props.features.map(({ name, path }) => {
    return `> ### :folder: [${name}](${path})\n\n`;
  });
}}
`;

/** MAIN **/

export type HomeProps = {
  features: {
    name: string;
    path: string;
  }[];
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
