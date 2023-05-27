import { Twind, TwindColors } from "./deps.ts";

const { apply } = Twind;

const surface: Record<string, Twind.Plugin> = {
  "surface-stroke": ([part = 1]) => {
    return apply`border-opacity-${part} dark:border-opacity-${part}`;
  },
  "surface-fill": ([part = 1]) => {
    return apply`bg-opacity-${part} dark:bg-opacity-${part}`;
  },
  "surface-contrast": () => {
    return apply`text-black dark:text-white`;
  },
  "surface-transparent": () => {
    return apply`surface-stroke-0 surface-fill-0`;
  },
  surface: ([color = "gray"]) => {
    return apply`
      border-1 box-border
      outline-none focus:outline-none
      transition-all duration-200
      text-${color}-700 dark:text-${color}-300
      border-${color}-600 dark:border-${color}-400
      bg-${color}-400 dark:bg-${color}-600
    `;
  },
};

const pill: Record<string, Twind.Plugin> = {
  pill: ([size]) => {
    const index = ["xs", "sm", "md", "lg"].indexOf(size);
    const height = (index + 3) * 8;
    const padding = (index + 1) * 2 + 1;
    return apply`
      inline-flex items-center
      h-[${height}px]
      min-w-[${height}px]
      ${size !== "md" ? `text-${size}` : ""}
      px-[${padding}px]
    `;
  },
  "pill-rounded": ([size]) => {
    const index = ["xs", "sm", "md", "lg"].indexOf(size);
    const radius = index * 2;
    return apply`rounded-[${radius}px]`;
  },
  "icon": ([size]) => {
    const index = ["xs", "sm", "md", "lg"].indexOf(size);
    const iconSize = (index + 4) * 4;
    return apply`w-[${iconSize}px] h-[${iconSize}px]`;
  },
};

const button: Record<string, Twind.Plugin> = {
  "button-disabled": () => {
    return apply`
      opacity-30 cursor-not-allowed
    `;
  },
  "button-interactive": () => {
    return apply`
      cursor-pointer
      hover:surface-fill-20
      active:surface-stroke-0
      active:transform active:scale-95
      focus:not-active:surface-stroke-50
    `;
  },
  "button-tinted": () => {
    return apply`
      surface-fill-10 
      hover:surface-fill-20
      focus:not-active:surface-stroke-50
    `;
  },
  "button-outlined": () => {
    return apply`
      hover:surface-fill-20
      surface-stroke-50 
      hover:surface-stroke-60
      focus:surface-stroke-100
    `;
  },
  button: ([size]) => {
    return apply`
      pill-${size}
      surface-fill-0 
      surface-stroke-0
      select-none
    `;
  },
};

export const DefaultTwindConfig = {
  theme: {
    colors: TwindColors,
  },
  plugins: {
    ...surface,
    ...pill,
    ...button,
  },
};
