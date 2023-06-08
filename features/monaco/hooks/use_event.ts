import { useEffect } from "preact/hooks";
import { MonacoEditorContext } from "../utils/types.ts";

/** MAIN **/

export function useEvent(
  editor: MonacoEditorContext | undefined,
  subscribe: (
    editor: MonacoEditorContext,
  ) => monaco.IDisposable,
) {
  useEffect(() => {
    if (!editor) return;
    const subscription = subscribe(editor);

    return () => {
      subscription.dispose();
    };
  }, [editor]);
}
