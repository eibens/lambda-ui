import {
  useMonacoEditor,
  useMonacoEditorSize,
  useMonacoEditorValue,
  useMonacoTheme,
} from "@litdoc/monaco";
import { Button, View, ViewChildren } from "@litdoc/ui";
import lit from "litdoc/lit";
import { useState } from "preact/hooks";

export const doc = lit();
const { md } = doc;

md`
# :folder: [Monaco](#monaco)

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

  const theme = useMonacoTheme("dark", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#00000000",
      "minimap.background": "#00000000",
    },
  });

  const editor = useMonacoEditor(element, {
    automaticLayout: true,
    theme,
  });

  if (editor) {
    monaco.editor.setTheme(theme);
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

  const isBrowser = typeof document !== "undefined";

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
          disabled={!isBrowser}
        />
        <Button
          onClick={toLower}
          color="pink"
          label="lowercase"
          tint
          disabled={!isBrowser}
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
    <View class="bg-gray-800 shadow-lg py-4 rounded-lg">
      {children}
    </View>
  );
}
