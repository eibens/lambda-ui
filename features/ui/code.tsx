import * as Dark from "@litdoc/dark";
import {
  useMonaco,
  useMonacoEditor,
  useMonacoEditorSize,
} from "@litdoc/monaco";
import { useSignalEffect } from "@preact/signals";
import { useEffect, useState } from "preact/hooks";
import { View } from "./view.tsx";

function useMonacoTheme() {
  const monaco = useMonaco();

  useEffect(() => {
    if (!monaco) return;
    monaco.editor.defineTheme("light", {
      base: "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#00000000",
        "minimap.background": "#00000000",
      },
    });

    monaco.editor.defineTheme("dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#00000000",
        "minimap.background": "#00000000",
      },
    });
  }, [monaco]);

  function updateTheme() {
    const isDark = Dark.store.value;
    if (!monaco) return;
    monaco.editor.setTheme(isDark ? "dark" : "light");
  }

  useSignalEffect(updateTheme);

  // TODO: turn monaco into a signal
  useEffect(() => {
    updateTheme();
  }, [monaco]);

  return Dark.store.value ? "dark" : "light";
}

function getLanguage(name?: string) {
  return {
    "js": "javascript",
    "ts": "typescript",
    "tsx": "typescript",
    "jsx": "javascript",
  }[name ?? ""] ?? name;
}

export function Code(props: {
  value?: string;
  lang?: string;
  readOnly?: boolean;
}) {
  const { value, readOnly, lang } = props;

  const [element, setElement] = useState<HTMLElement | null>(null);

  const theme = useMonacoTheme();

  const editor = useMonacoEditor(element, {
    value,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    readOnly,
    theme,
    language: getLanguage(lang),
    scrollbar: {
      vertical: "hidden",
      horizontal: "hidden",
      useShadows: false,
    },
    minimap: {
      enabled: false,
    },
  });

  const size = useMonacoEditorSize(editor);

  return (
    <View class="color-gray shadow-lg fill-10 py-4 rounded-md">
      <View
        onElement={setElement}
        style={{
          height: size.height + "px",
        }}
      />
    </View>
  );
}
