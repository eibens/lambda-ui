import { useMonaco } from "@/features/monaco/hooks/use_monaco.ts";
import { useMonacoEditor, useMonacoEditorSize } from "@/features/monaco/mod.ts";
import { useThemeSignal } from "@/features/theme/mod.ts";
import { View } from "@/features/theme/view.tsx";
import { useEffect, useState } from "preact/hooks";

function useMonacoTheme() {
  const isDark = useThemeSignal();

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

  useEffect(() => {
    if (!monaco) return;
    monaco.editor.setTheme(isDark.value ? "dark" : "light");
  }, [isDark.value, monaco]);

  return isDark.value ? "dark" : "light";
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
    <View
      class="color-gray shadow-lg fill-10 py-4 rounded-md"
      contentEditable={false}
    >
      <View
        onElement={setElement}
        style={{
          height: size.height + "px",
        }}
      />
    </View>
  );
}
