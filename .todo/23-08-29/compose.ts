
export function compose() {
  const calls = getTagCalls(value);

  const paths = weave(ast, calls);

  const { values = {}, children = [] } = options ?? {};

  const editor = createEditor();
  editor.type = "Root";
  editor.children = children;
  editor.values = values;

  const plugins = [
    Types.plugin(),
    Slugs.plugin(),
  ];

  for (const plugin of plugins) {
    plugin(editor);
  }

  Values.replaceAll(editor, values);
  Markdown.replaceAll(editor);
  Slots.replaceAll(editor);

  editor.normalize({ force: true });

  return editor;
}
