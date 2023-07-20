import { createLitdocRenderers, withLitdoc } from "litdoc";
import { createEditor, Editor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { MonacoProvider } from "../features/monaco/mod.ts";
import manifest from "../litdoc.gen.ts";

/** MAIN **/

export function routeFeature(path: string) {
  if (!(path in manifest.routes)) return;
  const value = manifest.routes[path as keyof typeof manifest.routes];

  const doc = value.default as (props: FeatureProps) => Editor;
  if (!doc) return;

  return [doc, path] as const;
}

export type FeatureProps = {
  path: string;
};

export default function Feature(props: FeatureProps) {
  const { path } = props;

  const route = routeFeature(path);

  if (!route) {
    return <div>Not found</div>;
  }

  const [doc] = route;
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
