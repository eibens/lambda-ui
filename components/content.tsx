import { View } from "@/features/theme/mod.ts";
import { Editable, Slate } from "slate-react";
import { LitEditor } from "../features/lit-doc/types.ts";

/** MAIN **/

export function Content(props: {
  editor: LitEditor;
}) {
  const { editor } = props;

  // TODO: Should not be done here.
  editor.children = [{
    type: "root",
    children: editor.children,
  }];

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
