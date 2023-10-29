import { Manifest } from "litdoc/lit.ts";
import type { Editor } from "slate";
import { create as createEditor, Page } from "./editor.ts";
import * as Router from "./router.ts";
import type { Bundle } from "./server.ts";

/** MAIN **/

export type { Bundle };

export type Result<T> = {
  status: "resolved";
  value: T;
} | {
  status: "rejected";
  value: null;
  error: Error;
} | {
  status: "pending";
  value: null;
  promise: Promise<T>;
} | {
  status: "missing";
  value: null;
};

export type Client = {
  hydrate: (bundle: Bundle) => void;
  getKey: (path: string) => string | null;
  getPage: (key: string) => Page;
  getEditor: (key: string) => Editor;
};

export function create(main: Manifest): Client {
  const bundle: Bundle = {
    pages: {},
    programs: {},
    roots: {},
    templates: {},
    texts: {},
  };
  return {
    getKey: (path) => {
      const resolution = Router.resolve(main, path);
      if (!resolution) {
        return null;
      }
      return resolution.key;
    },
    getPage: (key) => {
      const page = bundle.pages[key];
      if (!page) {
        throw new Error(`Could not find page ${key}. Bundler broken?`);
      }
      return page;
    },
    getEditor: (key) => {
      const root = bundle.roots[key];
      if (!root) {
        throw new Error(`Could not find root ${key}. Bundler broken?`);
      }
      return createEditor(root, {});
    },
    hydrate: (b) => {
      Object.assign(bundle.pages, b.pages);
      Object.assign(bundle.programs, b.programs);
      Object.assign(bundle.roots, b.roots);
      Object.assign(bundle.templates, b.templates);
      Object.assign(bundle.texts, b.texts);
    },
  };
}
