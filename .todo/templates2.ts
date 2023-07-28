import { Editor, Element, Node, Path, Transforms } from "slate";

/** HELPERS **/

function stringify(
  value: unknown,
  fallback?: (value: unknown) => string,
): string {
  const recurse = (value: unknown) => stringify(value, props, fallback);
  if (value === undefined) return "";
  if (value === null) return "";
  if (typeof value === "boolean") return "";
  if (typeof value === "number") return value.toString();
  if (typeof value === "string") return value;
  if (typeof value === "function") return recurse(value(props));
  if (Array.isArray(value)) return value.map(recurse).join("");
  if (fallback) return fallback(value);
  return String(value);
}

/** MAIN **/

export type ParserProps = {
  lang: string;
};

export type Parser = (text: string, props: ParserProps) => Editor;

export type Mixin = {
  parse: (path: Path) => void;
  values: Record<string, unknown>;
  templates: {
    parse: (path: Path) => void;
    inline: (path: Path) => void;
  };
};

export function fromLanguages(options: {
  parsers: Record<string, Parser>;
}): Parser {
  return (text, props) => {
    const { lang } = props;
    const parser = options.parsers[lang];
    if (!parser) throw new Error(`No parser for language "${lang}".`);
    return parser(text, props);
  };
}

export default function create(options: {
  parse: (text: string) => Node[];
  merge: (current: Editor, result: Editor) => void;
}) {
  const { parse } = options;
  return (editor: Editor) => {
    const mixin: Mixin = {
      templates: {
        parse: () => {
          for (const [node, path] of editor.nodes({ at: [] })) {
            if (!Element.isElement(node)) continue;
            if (node.type !== "Code") continue;

            const text = editor.string(path);
            const root = parse(text);

            Transforms.select(editor, {
              anchor: Editor.start(editor, path),
              focus: Editor.end(editor, path),
            });

            Transforms.insertFragment(editor, root.children);
          }
        },
        inline: (at: Path) => {
          // Replace the slots with explicit slot nodes.
          for (const [node, path] of editor.nodes({ at })) {
            if (!Element.isElement(node)) continue;
            if (node.type !== "Value") continue;

            const value = editor.values[node.id];
            if (Node.isNode(value)) {
              Transforms.select(editor, {
                anchor: Editor.start(editor, path),
                focus: Editor.end(editor, path),
              });

              editor.setNodes({
                children: [{ type: "Text", text: "" }],
              }, { at });
            }
          }
        },
      },
    };

    return Object.assign(editor, mixin);
  };
}
