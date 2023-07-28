import { Editor, Node, Path } from "slate";

export type BaseNode = {
  key?: string;
};

export type Mixin = {
  getTitle: (options: { at: Path }) => string | null;
  getLead: (options: { at: Path }) => string | null;
};

export function create() {
  return (editor: Editor) => {
    const mixin: Mixin = {
      getTitle: ({ at }) => {
        const nodes = Editor.nodes(editor, {
          at,
          match: (node) => node.type === "Heading",
        });

        for (const [node] of nodes) {
          return Node.string(node);
        }

        return null;
      },

      getLead: ({ at }) => {
        const nodes = Editor.nodes(editor, {
          at,
          match: (node) => node.type === "Paragraph",
        });

        for (const [node] of nodes) {
          return Node.string(node);
        }

        return null;
      },
    };

    return Object.assign(editor, mixin);
  };
}
