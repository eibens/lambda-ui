import { MonacoProvider } from "@litdoc/monaco";
import { fromComponents } from "@litdoc/render";
import * as Theme from "@litdoc/theme";
import { createFromManifest } from "litdoc";
import { Editable, Slate, withReact } from "slate-react";
import manifest from "../litdoc.gen.ts";

export default function Content(props: {
  path: string;
}) {
  const { path } = props;

  const editor = createFromManifest({
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
    <MonacoProvider>
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
    </MonacoProvider>
  );
}
