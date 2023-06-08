import { useEffect, useState } from "preact/hooks";
import { MonacoEditorContext } from "../utils/types.ts";
import { useMonaco } from "./use_monaco.ts";

/** MAIN **/

export function useEditor(
  element: HTMLElement | null | undefined,
  options: monaco.editor.IStandaloneEditorConstructionOptions,
) {
  const [editor, setEditor] = useState<MonacoEditorContext>();
  const monaco = useMonaco();

  useEffect(() => {
    if (!element) return;
    if (!monaco) return;

    const editor = monaco.editor.create(
      element,
      options,
    );

    setEditor(editor);

    return () => {
      editor.dispose();
    };
  }, [element, monaco]);

  return editor;
}
