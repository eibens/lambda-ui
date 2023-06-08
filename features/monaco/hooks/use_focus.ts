import { useState } from "preact/hooks";
import { MonacoEditorContext } from "../utils/types.ts";
import { useEvent } from "./use_event.ts";

/** MAIN **/

export function useFocus(
  editor: MonacoEditorContext | undefined,
) {
  const [focused, setFocused] = useState(false);

  useEvent(editor, (editor) => {
    return editor.onDidFocusEditorWidget(() => {
      setFocused(true);
    });
  });

  useEvent(editor, (editor) => {
    return editor.onDidBlurEditorWidget(() => {
      setFocused(false);
    });
  });

  return focused;
}
