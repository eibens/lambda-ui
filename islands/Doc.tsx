import * as Litdoc from "litdoc/mod.ts";
import { Library } from "litdoc/mod.ts";
import * as Theme from "litdoc/theme/mod.ts";
import { Editable, Slate, withReact } from "slate-react";
import manifest from "../litdoc.gen.ts";

export default function Doc(props: {
  library: Library;
  file: string;
}) {
  const { library, file } = props;

  const litdoc = Litdoc.client({
    modules: manifest.routes,
    library,
  });

  const editor = withReact(litdoc.getEditor(file));

  const editable = Theme.create();

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
        {...editable}
      />
    </Slate>
  );
}
