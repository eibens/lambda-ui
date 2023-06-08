import { useCallback, useEffect, useState } from "preact/hooks";
import { MonacoEditorContext } from "../utils/types.ts";
import { useEvent } from "./use_event.ts";

/** HELPERS **/

function getWidth(editor: MonacoEditorContext) {
  return Math.min(
    editor.getContentWidth(),
    editor.getScrollWidth(),
  ) ?? 0;
}

function getHeight(editor: MonacoEditorContext) {
  return Math.min(
    editor.getContentHeight(),
    editor.getScrollHeight(),
  ) ?? 0;
}

function getSize(editor: MonacoEditorContext | undefined) {
  if (!editor) return { width: 0, height: 0 };
  return {
    width: getWidth(editor),
    height: getHeight(editor),
  };
}

/** MAIN **/

export function useSize(editor: MonacoEditorContext | undefined) {
  const [size, setSize] = useState(getSize(editor));

  const update = useCallback(() => {
    // TODO: check if size changed
    setSize(getSize(editor));
  }, [editor]);

  useEffect(() => {
    update();
  }, [editor]);

  useEvent(editor, (editor) => {
    return editor.onDidScrollChange(() => {
      update();
    });
  });

  useEvent(editor, (editor) => {
    return editor.onDidChangeModelContent(() => {
      update();
    });
  });

  return size;
}
