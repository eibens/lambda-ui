import * as Markdown from "./markdown.ts";
import * as Module from "./module.ts";

export function setManifest(manifest: Record<string, Record<string, unknown>>) {
  for (const [path, mod] of Object.entries(manifest)) {
    Module.set(path, mod);
  }
}

export function getMarkdown(file: string) {
  return Markdown.get(file);
}
