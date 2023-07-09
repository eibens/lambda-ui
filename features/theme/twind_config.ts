import { Twind, TwindColors } from "./deps.ts";

const { apply } = Twind;

export const DefaultTwindConfig: Omit<Twind.Configuration, "mode" | "sheet"> = {
  darkMode: "class",
  preflight: {
    html: apply`
      bg-gray-100 text-gray-800 
      font-serif
      transition-colors duration-200
    `,
    "html.dark": apply`
      bg-gray-900 text-gray-200
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
