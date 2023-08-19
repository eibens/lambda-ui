import { fromComponents } from "@litdoc/render";
import * as Theme from "@litdoc/theme";
import { Manifest } from "litdoc";
import { Editable, Slate, withReact } from "slate-react";
import { Debugger } from "../features/debug/components/Debugger.tsx";
import manifest from "../litdoc.gen.ts";

export default function Content(props: {
  path: string;
}) {
  const { path } = props;

  const page = Manifest.createPage(manifest, path);

  if (!page) {
    return <div class="color-red">Page not found: {path}</div>;
  }

  const reactEditor = withReact(page.editor);

  const {
    renderElement,
    renderLeaf,
  } = fromComponents(Theme);

  return (
    <>
      <Slate
        editor={reactEditor}
        initialValue={page.editor.children}
      >
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          readOnly
        />
      </Slate>
      <Debugger editor={page.editor} />
    </>
  );
}
