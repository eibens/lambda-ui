import { useEffect } from "preact/hooks";
import { useMonaco } from "./use_monaco.ts";

/** MAIN **/

const themes = new Set<string>();

export function useTheme(
  name: string,
  themeData: monaco.editor.IStandaloneThemeData,
) {
  const monaco = useMonaco();
  useEffect(() => {
    if (!monaco) return;
    if (themes.has(name)) {
      throw new Error(`Monaco editor theme ${name} already exists`);
    }
    monaco.editor.defineTheme(name, themeData);
    themes.add(name);
  }, [monaco]);

  return name;
}
