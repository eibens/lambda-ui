export function getTitle(editor: Editor, options?: {
  at?: Path;
}): string | undefined {
  const { at = [] } = options ?? {};

  const nodes = editor.nodes({
    at,
    match: (node) => node.type === "Heading",
  });

  for (const [node] of nodes) {
    return Node.string(node).trim();
  }
}

export function getLead(editor: Editor, options?: {
  at?: Path;
}): string | undefined {
  const { at = [] } = options ?? {};

  const nodes = editor.nodes({
    at,
    match: (node) => node.type === "Paragraph",
  });

  for (const [node] of nodes) {
    return Node.string(node).trim();
  }
}

export function getIcon(editor: Editor, options?: {
  at?: Path;
}): string | undefined {
  const { at = [] } = options ?? {};

  const nodes = editor.nodes({
    at,
    voids: true,
    match: (node) => node.type === "Icon",
  });

  for (const [node] of nodes) {
    if (node.type === "Icon") {
      return node.name;
    }
  }
}
