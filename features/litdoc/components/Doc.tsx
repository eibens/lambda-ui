import { Components, fromComponents } from "@litdoc/render";
import { createFromManifest } from "litdoc";
import { Editable, Slate, withReact } from "slate-react";

export type DocProps = {
  path: string;
  components: Components;
  manifest: {
    routes: Record<string, unknown>;
  };
};

export function Doc(props: DocProps) {
  const { path, components } = props;

  const editor = createFromManifest(props);

  if (!editor) {
    return <div class="color-red">Path not found: {path}</div>;
  }

  const reactEditor = withReact(editor);

  const {
    renderElement,
    renderLeaf,
  } = fromComponents(components);

  return (
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
  );
}
