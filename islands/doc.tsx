import { fromComponents } from "@litdoc/render";
import * as Theme from "@litdoc/theme";
import { create } from "litdoc";
import { Tags } from "litdoc/lit";
import { Editable, Slate, withReact } from "slate-react";
import { MonacoProvider } from "../features/monaco/mod.ts";
import manifest from "../litdoc.gen.ts";

/** MAIN **/

export type DocProps = {
  path?: string;
};

export default function Doc(props: DocProps) {
  const { path } = props;

  if (typeof path !== "string") {
    return <div>404 (TODO: real error message)</div>;
  }

  const mod = manifest.routes[path as keyof typeof manifest.routes];
  const { doc } = mod as { doc: Tags<unknown> };

  if (typeof doc !== "function") {
    return <div>404 (TODO: real error message)</div>;
  }

  const editor = withReact(create(doc()));
  const { renderElement, renderLeaf } = fromComponents(Theme);
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
