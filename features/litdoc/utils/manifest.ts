import { TagsState } from "litdoc/lit";
import { Editor } from "slate";
import { createFromTags, getIcon, getLead, getTitle } from "./editor.ts";

export type Page = {
  editor: Editor;
  file: string;
  path: string[];
  url: string;
  title?: string;
  icon?: string;
  lead?: string;
};

export type Manifest = {
  routes: Record<string, unknown>;
};

export type DocModule = {
  doc: () => TagsState;
};

export function createPage(manifest: Manifest, file: string): Page {
  const mod = manifest.routes[file as keyof typeof manifest.routes];
  const { doc } = mod as DocModule;

  if (typeof doc !== "function") {
    throw new Error("Expected doc to be a function");
  }

  if (!file.endsWith(".tsx")) {
    throw new Error("Only files ending with .tsx are supported.");
  }

  const path = file
    .slice(0, -".tsx".length)
    .split("/")
    .filter(Boolean);

  if (path[path.length - 1] === "index") {
    path.pop();
  }

  const state = doc();
  const editor = createFromTags(state);

  return {
    editor,
    file,
    path,
    title: getTitle(editor),
    lead: getLead(editor),
    url: "/" + path.join("/"),
    icon: getIcon(editor),
  };
}

export function createIndex(manifest: Manifest, options: {
  match: RegExp;
}) {
  const { match } = options;
  return Object.keys(manifest.routes)
    .filter((file) => match.test(file))
    .sort((a, b) => a.localeCompare(b))
    .map((file) => createPage(manifest, file));
}
