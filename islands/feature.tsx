import { Editable, Slate } from "slate-react";
import {
  Context,
  Http,
  LitDoc,
  withBasicTheme,
  withTemplate,
} from "../features/lit-doc/mod.ts";
import { MonacoProvider } from "../features/monaco/mod.ts";
import manifest from "../lit.gen.ts";

/** MAIN **/

export type FeatureProps = {
  path: string;
};

export default function Feature(props: FeatureProps) {
  const { path } = props;

  const { routes } = manifest;

  const route = Http.resolve(routes, "./" + path);

  if (!route) {
    return <div>Not found</div>;
  }

  const { default: doc } = route.value as {
    default: (props: FeatureProps) => LitDoc;
  };

  const editor = Context.create(() => {
    withBasicTheme();
    withTemplate(doc(props));
  });

  editor.normalize({ force: true });

  return (
    <MonacoProvider>
      <Slate
        editor={editor}
        initialValue={editor.children}
      >
        <Editable
          renderElement={editor.renderElement}
          renderLeaf={editor.renderLeaf}
          readOnly
        />
      </Slate>
    </MonacoProvider>
  );
}
