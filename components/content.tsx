import { Context, withBasicTheme, withEditor } from "@/features/lit-doc/mod.ts";
import { View } from "@/features/theme/mod.ts";
import { Editable, Slate } from "slate-react";
import { LitElement } from "../features/lit-doc/types.ts";

/** MAIN **/

export function Content(props: {
  editor: {
    children: LitElement[];
    slots: Record<string, unknown>;
  };
}) {
  const editor = Context.create(() => {
    withBasicTheme();
    const editor = withEditor();
    editor.children = [{
      type: "root",
      children: props.editor.children,
    }];
    Object.assign(
      editor.slots,
      props.editor.slots,
    );
    editor.normalize({ force: true });
  });
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
