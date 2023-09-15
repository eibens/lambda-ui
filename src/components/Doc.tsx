import { useLitdoc } from "litdoc/hooks/use_litdoc.ts";
import { Editable, Slate } from "slate-react";

export function Doc(props: {
  file: string;
}) {
  const { file } = props;

  const litdoc = useLitdoc();
  const editor = litdoc.getEditor(file);
  const renderers = LitdocUtils.renderers();

  return (
    <Slate
      editor={editor}
      initialValue={editor.children}
    >
      <Editable
        // @ts-ignore must be string to work
        spellCheck="false"
        readOnly
        style={{
          padding: "16px",
        }}
        {...renderers}
      />
    </Slate>
  );
}
