import { create } from "litdoc/utils/editor.ts";
import { Root } from "litdoc/utils/schema.ts";

/** MAIN **/

export type Library = {
  [key: string]: Root;
};

export type RouteMeta = {
  file: string;
  path: string;
  title?: string;
  icon?: string;
  color?: string;
  description?: string;
};

export type Route = RouteMeta & {
  root: Root;
};

export function route(library: Library, path: string): Route {
  const file = "./" + path;
  const root = library[file];
  const editor = create(root);
  return {
    file,
    path,
    icon: editor.getIcon(),
    title: editor.getTitle(),
    color: editor.getColor(),
    description: editor.getLead(),
    root,
  };
}
