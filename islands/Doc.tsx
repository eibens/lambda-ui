import { fromComponents } from "@litdoc/render";
import * as Theme from "@litdoc/theme";
import { LitdocEditor } from "litdoc";
import { Editable, Slate, withReact } from "slate-react";
import { Debugger } from "../features/debug/components/Debugger.tsx";
import manifest from "../litdoc.gen.ts";

export default function Content(props: {
  path: string;
}) {
  const { path } = props;

  const editor = LitdocEditor.createFromManifest({
    path,
    manifest,
  });

  if (!editor) {
    return <div class="color-red">Path not found: {path}</div>;
  }

  const reactEditor = withReact(editor);

  const {
    renderElement,
    renderLeaf,
  } = fromComponents(Theme);

  return (
    <>
      <Slate
        editor={reactEditor}
        initialValue={editor.children}
      >
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          readOnly
        />
      </Slate>
      <Debugger editor={editor} />
    </>
  );
}
