import { monaco } from "./monaco.d.ts";

/** MAIN **/

export const MONACO_DEFAULT_PATH =
  "https://cdn.jsdelivr.net/npm/monaco-editor@0.36.1/min/vs";

export type Monaco = typeof monaco;

export type MonacoEditorContext = monaco.editor.IStandaloneCodeEditor;
