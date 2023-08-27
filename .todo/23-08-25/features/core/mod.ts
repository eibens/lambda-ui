export * as Dark from "./dark.ts";
export { default as dev } from "./dev.ts";
import { Node } from "slate";
import { RenderNodeProps } from "./render.tsx";

/** HELPERS **/

/** MAIN **/

export type Corpus = {
  files: Record<string, unknown>;
  root: string;
};


export type Theme = {
  colors: Record<string, string>;
  icons: Record<string, string>;
  components: {
    [T in Node["type"]]: (props: RenderNodeProps) => JSX.Element;
  };
}