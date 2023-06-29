import { LitEditor } from "@/features/lit-doc/mod.ts";
import { View } from "@/features/theme/mod.ts";
import { Editable, Slate } from "slate-react";

/** MAIN **/

export function Content(props: {
  editor: LitEditor;
}) {
  const { editor } = props;

  return (
    <View class="my-32 px-6 w-full max-w-3xl">
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
    </View>
  );
}
