import { ViewChildren, ViewNode } from "../theme/view.tsx";
import { DefaultTheme } from "./default_theme.tsx";
import { MarkdownContext } from "./markdown_context.ts";
import type { Theme } from "./types.ts";

/** MAIN **/

export function MarkdownProvider(props: {
  children: ViewChildren;
  theme?: Partial<Theme<ViewNode>>;
}) {
  const { theme, children } = props;
  return (
    <MarkdownContext.Provider
      value={{
        slots: {},
        theme: {
          ...DefaultTheme,
          ...theme,
        },
      }}
    >
      {children}
    </MarkdownContext.Provider>
  );
}
