import * as TwindColors from "https://esm.sh/twind@0.16.17/colors";
import { Editor, Path } from "slate";
import * as Twind from "twind";

/** HELPERS **/

const { apply } = Twind;

/** MAIN **/

export { Meta } from "./components/Meta.tsx";
export { Theme } from "./components/Theme.tsx";
export { View } from "./components/View.tsx";
export { getIcon } from "./editor.ts";

export const TwindConfig: Omit<Twind.Configuration, "mode" | "sheet"> = {
  darkMode: "class",
  preflight: {
    html: apply`
      bg-gray-100 text-gray-800 
      font-serif
      transition-colors
    `,
    "html.dark": apply`
      bg-gray-900 text-gray-200
    `,
    "::selection": apply`
      bg-gray-400 dark:bg-gray-600
    `,
  },
  theme: {
    colors: TwindColors,
    fontFamily: {
      sans: ['"PT Sans"', "sans-serif"],
      serif: ['"PT Serif"', "serif"],
      mono: ['"JetBrains Mono"', "monospace"],
    },
  },
  plugins: {
    fill: ([amount]) => {
      return apply`
        bg-opacity-${amount} dark:bg-opacity-${amount}
      `;
    },
    stroke: ([amount]) => {
      return apply`
        border-opacity-${amount} dark:border-opacity-${amount}
      `;
    },
    color: ([color = "gray"]) => {
      return apply`
        text-${color}-700 dark:text-${color}-300
        border-${color}-600 dark:border-${color}-400
        bg-${color}-400 dark:bg-${color}-600
      `;
    },
    label: ([size]) => {
      const index = ["xs", "sm", "md", "lg"].indexOf(size);
      const padding = (index + 1) * 2;
      return apply`
      ${size !== "md" ? `text-${size}` : ""}
        px-[${padding}px]
      `;
    },
    pill: ([size]) => {
      const index = ["xs", "sm", "md", "lg"].indexOf(size);
      const height = (index + 3) * 8;
      const padding = (index + 1) * 2 + 1;
      const radius = ["sm", "md", "lg", "xl"][index];
      return apply`
        inline-flex items-center
        h-[${height}px]
        min-w-[${height}px]
        px-[${padding}px]
        rounded-${radius}
      `;
    },
    icon: ([size]) => {
      const index = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"].indexOf(
        size,
      );
      const iconSize = (index + 4) * 4;
      return apply`w-[${iconSize}px] h-[${iconSize}px]`;
    },
  },
};

export function getSpacing(editor: Editor, at: Path = []) {
  const [node, path] = editor.node(at);

  const unit = 16;

  // No spacing for last nodes.
  const nextEntry = editor.next({ at: path });
  if (!nextEntry) return 0;
  const [next] = nextEntry;

  const isHeading = node.type === "Heading";
  const isNextHeading = next.type === "Heading";
  if (isHeading && isNextHeading) return unit;
  if (isHeading) return unit;
  if (isNextHeading) return 6 * unit;

  // The first paragraph after a heading is the lead.
  // It has a fixed spacing to the following element.
  if (node.type === "Paragraph") {
    const prevEntry = editor.previous({ at: path });
    if (prevEntry) {
      const [prev] = prevEntry;
      if (prev.type === "Heading") return 3 * unit;
    }
  }

  if (node.type === next.type) return unit;

  // Reduce spacing between these elements.
  const narrow = ["Paragraph", "ListItem", "List"];
  const isNarrow = narrow.includes(node.type);
  const isNextNarrow = narrow.includes(next.type);
  if (isNarrow && isNextNarrow) return unit;

  return 3 * unit;
}

export function getFontSize(editor: Editor, at: Path = []) {
  const [node, path] = editor.node(at);

  const unit = 4;
  const base = 4;

  if (node.type === "Heading") {
    const i = node.depth - 1;
    const s = [8, 6, 4, 3, 2, 1][i];
    return unit * (s + base);
  }

  if (node.type === "ListItem") {
    return getFontSize(editor, path.concat(0));
  }

  const prevEntry = editor.previous({ at: path });
  if (prevEntry) {
    const [prevNode] = prevEntry;
    if (prevNode.type == "Heading") {
      const level = prevNode.depth;
      return (6 - level) * 2 + unit * base;
    }
  }

  return unit * base;
}

export function getLineHeight(editor: Editor, at: Path = []) {
  return getFontSize(editor, at) * 1.5;
}

export function getListIndent(editor: Editor, at: Path = []) {
  return getLineHeight(editor, at) + 2;
}
