import { useEnv } from "@/features/client/mod.ts";
import {
  useMonacoEditor,
  useMonacoEditorSize,
  useMonacoEditorValue,
  useMonacoTheme,
} from "@/features/monaco/mod.ts";
import { useTheme, View } from "@/features/theme/mod.ts";
import { ViewChildren } from "@/features/theme/view.tsx";
import { Button } from "@/features/widgets/button.tsx";
import { lit } from "litdoc";
import { useState } from "preact/hooks";

/** MAIN **/

const { md, doc } = lit();
export default doc;

md`
# [Monaco](#)

[Monaco Editor](https://github.com/microsoft/monaco-editor) is the code editor that powers VS Code. 
It is a standalone code editor that can be used in any JavaScript application.
This package provides Preact hooks for using Monaco Editor.

### \`useMonacoEditor\`

The \`useMonacoEditor\` hook creates a new editor.

${<MinimalEditor />}
`;

function MinimalEditor() {
  const [element, setElement] = useState<HTMLElement | null>(null);

  useMonacoEditor(element, {
    value: "const a = 1;",
    language: "javascript",
    automaticLayout: true,
  });

  return (
    <Example>
      <View
        onElement={setElement}
        style={{
          height: "200px",
        }}
      />
    </Example>
  );
}

md`
### \`useMonacoEditorTheme\`

The \`useMonacoEditorTheme\` hook applies a theme to all editors.

> **Note:** The theme is applied to all editors.
> This is an [architectural limitation](https://github.com/Microsoft/monaco-editor/issues/338) of Monaco Editor.

${<Themed />}
`;

function Themed() {
  const [element, setElement] = useState<HTMLElement | null>(null);

  const theme = useTheme();

  const lightTheme = useMonacoTheme("light", {
    base: "vs",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#00000000",
      "minimap.background": "#00000000",
    },
  });

  const darkTheme = useMonacoTheme("dark", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#00000000",
      "minimap.background": "#00000000",
    },
  });

  const monacoTheme = theme.name === "dark" ? darkTheme : lightTheme;

  const editor = useMonacoEditor(element, {
    automaticLayout: true,
    theme: monacoTheme,
  });

  if (editor) {
    monaco.editor.setTheme(theme.name);
  }

  return (
    <Example>
      <View
        onElement={setElement}
        style={{
          height: "200px",
        }}
      />
    </Example>
  );
}

md`
### \`useMonacoEditorSize\`

The \`useMonacoEditorSize\` hook returns the size of the editor content.

${<AutoHeight />}
`;

function AutoHeight() {
  const [element, setElement] = useState<HTMLElement | null>(null);

  const editor = useMonacoEditor(element, {
    scrollBeyondLastLine: false,
    automaticLayout: true,
    scrollbar: {
      vertical: "hidden",
      horizontal: "hidden",
      useShadows: false,
    },
  });

  const size = useMonacoEditorSize(editor);

  return (
    <Example>
      <View
        onElement={setElement}
        style={{
          height: size.height + "px",
        }}
      />
    </Example>
  );
}

md`
### \`useMonacoEditorValue\`

The \`useMonacoEditorValue\` hook allows to manipulate the editor value.

${<ManipulateValue />}
`;

function ManipulateValue() {
  const [element, setElement] = useState<HTMLElement | null>(null);

  const editor = useMonacoEditor(element, {
    value: "This is some text with UPPER and lower case.",
    automaticLayout: true,
  });

  const [value, setValue] = useMonacoEditorValue(editor);

  function toUpper() {
    setValue(value.toUpperCase());
  }

  function toLower() {
    setValue(value.toLowerCase());
  }

  const env = useEnv();

  return (
    <View class="flex flex-col color-gray shadow-lg fill-10 pt-4 rounded-lg">
      <View
        onElement={setElement}
        style={{
          height: "200px",
        }}
      />
      <View class="flex gap-2 p-2">
        <Button
          onClick={toUpper}
          color="blue"
          label="UPPERCASE"
          tint
          disabled={!env.isBrowser}
        />
        <Button
          onClick={toLower}
          color="pink"
          label="lowercase"
          tint
          disabled={!env.isBrowser}
        />
      </View>
    </View>
  );
}

md``;

/** HELPERS **/

function Example(props: {
  children: ViewChildren;
}) {
  const { children } = props;
  return (
    <View class="color-gray shadow-lg fill-10 py-4 rounded-lg">
      {children}
    </View>
  );
}
