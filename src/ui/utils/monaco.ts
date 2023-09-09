import { useSignalEffect } from "@preact/signals";
import { signal } from "@preact/signals-core";
import { useCallback, useEffect, useState } from "preact/hooks";
import "../assets/monaco.d.ts";

let promise: Promise<Monaco> | undefined;

/** MAIN **/

export type Monaco = typeof monaco;

export type MonacoEditorContext = monaco.editor.IStandaloneCodeEditor;

/**
 * Signal that emits the Monaco Editor instance as soon as it is loaded.
 */
export const store = signal<Monaco | undefined>(undefined);

export const DEFAULT_PATH =
  "https://cdn.jsdelivr.net/npm/monaco-editor@0.36.1/min/vs";

/**
 * Load Monaco Editor files and return the instance.
 *
 * If the files are already loaded, it returns the instance immediately.
 *
 * It uses jsdeliver.net as a CDN by default, but you can specify a different
 * path if you want to host the files yourself.
 *
 * @param options.path Path to the Monaco Editor files.
 */
export function load(options?: {
  path?: string;
}) {
  const { path = DEFAULT_PATH } = options ?? {};

  if (promise) {
    return promise;
  }

  const src = `${path}/loader.js`;
  const script = document.createElement("script");
  script.src = src;
  document.body.appendChild(script);

  promise = new Promise<Monaco>((resolve, reject) => {
    script.onload = () => {
      const require = Reflect.get(window, "require");

      require.config({
        paths: {
          vs: path,
        },
      });

      require(
        ["vs/editor/editor.main"],
        (instance: Monaco) => {
          store.value = instance;
          resolve(instance);
        },
        (error: Error) => {
          reject(error);
        },
      );
    };

    script.onerror = () => {
      reject(new Error("Failed to load Monaco loader script."));
    };
  });

  return promise;
}

export function useInstance(): Monaco | undefined {
  const [instance, setInstance] = useState<Monaco | undefined>(undefined);

  useEffect(() => {
    // Auto-load monaco if not already loaded.
    load();
  }, []);

  useSignalEffect(() => {
    setInstance(store.value);
  });

  return instance;
}

export function useEditor(
  element: HTMLElement | null | undefined,
  options: monaco.editor.IStandaloneEditorConstructionOptions,
) {
  const [editor, setEditor] = useState<MonacoEditorContext>();
  const monaco = useInstance();

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

export function getWidth(editor: MonacoEditorContext) {
  return Math.min(
    editor.getContentWidth(),
    editor.getScrollWidth(),
  ) ?? 0;
}

export function getHeight(editor: MonacoEditorContext) {
  return Math.min(
    editor.getContentHeight(),
    editor.getScrollHeight(),
  ) ?? 0;
}

export function getSize(editor: MonacoEditorContext | undefined) {
  if (!editor) return { width: 0, height: 0 };
  return {
    width: getWidth(editor),
    height: getHeight(editor),
  };
}

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
