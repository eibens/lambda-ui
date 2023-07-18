import * as Manifest from "@lambda-ui/manifest";
import { createLitdocRenderers, withLitdoc } from "litdoc";
import { createEditor, Editor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { MonacoProvider } from "../features/monaco/mod.ts";
import manifest from "../litdoc.gen.ts";

/** MAIN **/

export type FeatureProps = {
  path: string;
};

export default function Feature(props: FeatureProps) {
  const { path } = props;

  const { routes } = manifest;

  const route = Manifest.route(routes, "./" + path);

  if (!route) {
    return <div>Not found</div>;
  }

  const { default: doc } = route.value as {
    default: (props: FeatureProps) => Editor;
  };

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
