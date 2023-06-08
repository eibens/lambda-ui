import { useCallback, useEffect, useState } from "preact/hooks";
import { MonacoEditorContext } from "../utils/types.ts";
import { useEvent } from "./use_event.ts";

/** MAIN **/

export function useValue(editor: MonacoEditorContext | undefined) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!editor) return;
    setValue(editor.getModel()?.getValue() ?? "");
  }, [editor]);

  useEvent(editor, (editor) => {
    return editor.onDidChangeModelContent(() => {
      setValue(editor.getModel()?.getValue() ?? "");
    });
  });

  const update = useCallback((value: string) => {
    if (!editor) return;
    if (value === editor.getModel()?.getValue()) return;
    editor.getModel()?.setValue(value);
  }, [editor]);

  return [value, update] as const;
}
