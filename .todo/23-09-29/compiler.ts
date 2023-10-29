import { extname } from "$std/key/extname.ts";
import { decompress } from "https://deno.land/x/lz4@v0.1.2/mod.ts";
import type * as Lit from "litdoc/lit.ts";
import * as Editor from "./editor.ts";
import * as Linker from "./linker.ts";
import * as Loader from "./loader.ts";
import * as Markdown from "./markdown.ts";
import * as Storage from "./storage.ts";
import * as Swc from "./swc.ts";
import * as Weaver from "./weaver.ts";

/** HELPERS **/

function cached<T>(
  type: string,
  loader: Loader.Loader<T>,
  cache: Storage.Storage<T>,
) {
  return Loader.concurrent(Loader.cached(
    Storage.logged(type, cache),
    Loader.logged(type, loader),
  ));
}

function cachedText(cache: Storage.Storage<Uint8Array>, ext: string) {
  return Storage.decode(
    Storage.resolve(cache, (key) => key + ext),
  );
}

function cachedJson<T>(cache: Storage.Storage<Uint8Array>, ext: string) {
  return Storage.parse<T>(cachedText(cache, ext));
}

function createManifestLoader(context: Context) {
  const { getModule } = context;
  return async (key: string) => {
    const module = await getModule(key);
    return Linker.getManifest(module);
  };
}

function createProgramLoader(context: Context) {
  const { getText, getWasm } = context;
  return async (key: string) => {
    const text = await getText(key);
    const swc = await getWasm(Swc.PATH);
    return Swc.parse(swc, text, key);
  };
}

function createTemplateLoader(context: Context) {
  const { getProgram, getText, getManifest } = context;
  return async (key: string) => {
    const manifest = await getManifest(key);
    if (!manifest) return null;

    const { calls } = manifest;
    const program = await getProgram(key);
    if (!program) return Weaver.weave(calls).text;

    const text = await getText(key);
    return Weaver.weave(calls, { program, text }).text;
  };
}

function createValuesLoader(context: Context) {
  return async (key: string) => {
    const manifest = await context.getManifest(key);
    if (!manifest) return [];
    const { calls } = manifest;
    return Weaver.weave(calls).values;
  };
}

function createRootLoader(context: Context) {
  const { getTemplate, getText } = context;
  return async (key: string): Promise<Markdown.Root> => {
    const lang = extname(key).slice(1);
    const template = await getTemplate(key);
    if (template) return Markdown.parse(template);

    const text = await getText(key);
    if (lang === "md") return Markdown.parse(text);

    return Markdown.code(text, lang);
  };
}

function createEditorLoader(context: Context) {
  const { getValues, getRoot } = context;
  return async (key: string) => {
    const values = await getValues(key);
    const root = await getRoot(key);
    const valueMap = Object.fromEntries(values.entries());
    return Editor.create(root, valueMap);
  };
}

function createPageLoader(context: Context) {
  return async (key: string): Promise<Editor.Page> => {
    const editor = await context.getEditor(key);
    return {
      breadcrumbs: [],
      relations: [],
      color: Editor.getColor(editor),
      description: Editor.getLead(editor),
      icon: Editor.getIcon(editor),
      title: Editor.getTitle(editor),
    };
  };
}

/** MAIN **/

export type Context = {
  getModule: (key: string) => Promise<unknown>;
  getManifest: (key: string) => Promise<Lit.Manifest | null>;
  getValues: (key: string) => Promise<Lit.Value[]>;
  getText: (key: string) => Promise<string>;
  getBinary: (key: string) => Promise<Uint8Array>;
  getWasm: (key: string) => Promise<Uint8Array>;
  getProgram: (key: string) => Promise<Swc.Program>;
  getTemplate: (key: string) => Promise<string | null>;
  getRoot: (key: string) => Promise<Markdown.Root>;
  getEditor: (key: string) => Promise<Editor.LitdocEditor>;
  getPage: (key: string) => Promise<Editor.Page>;
  invalidate: (key: string) => Promise<void>;
};

export function create(options: {
  cache: Storage.Storage<Uint8Array>;
  read: (key: string) => Promise<Uint8Array>;
  import: (key: string) => Promise<unknown>;
}): Context {
  const { cache, read, import: getModule } = options;

  // NOTE: The getter functions must be wrapped in a closure.
  // This allows later inter-dependence between the pipeline steps.
  // Inspect the loaders if you happen to cause a circular dependency.
  const context: Context = {
    getModule: (key) => modules.get(key),
    getManifest: (key) => manifests.get(key),
    getValues: (key) => values.get(key),
    getText: (key) => texts.get(key),
    getBinary: (key) => binaries.get(key),
    getWasm: (key) => wasm.get(key),
    getProgram: (key) => programs.get(key),
    getTemplate: (key) => templates.get(key),
    getRoot: (key) => roots.get(key),
    getEditor: (key) => editors.get(key),
    getPage: (key) => pages.get(key),
    invalidate: (key) => manager.delete(key),
  };

  // Create loaders.
  const moduleLoader = Loader.func(getModule);
  const binariesLoader = Loader.fetcher(Swc.ASSETS);
  const textLoader = Loader.decode(Loader.func(read));
  const manifestLoader = Loader.func(createManifestLoader(context));
  const programLoader = Loader.func(createProgramLoader(context));
  const templateLoader = Loader.func(createTemplateLoader(context));
  const valuesLoader = Loader.func(createValuesLoader(context));
  const rootLoader = Loader.func(createRootLoader(context));
  const editorLoader = Loader.func(createEditorLoader(context));
  const pageLoader = Loader.func(createPageLoader(context));

  // Create caches for the generated artifacts.
  const moduleCache = Storage.async(Storage.memory<unknown>());
  const manifestCache = Storage.async(Storage.memory<Lit.Manifest | null>());
  const valuesCache = Storage.async(Storage.memory<Lit.Value[]>());
  const wasmCache = Storage.async(Storage.memory<Uint8Array>());
  const textCache = Storage.async(Storage.memory<string>());
  const editorCache = Storage.async(Storage.memory<Editor.LitdocEditor>());
  const programCache = cachedJson<Swc.Program>(cache, ".program.json");
  const templateCache = Storage.optional(cachedText(cache, ".template.md"));
  const rootCache = cachedJson<Markdown.Root>(cache, ".root.json");
  const pageCache = cachedJson<Editor.Page>(cache, ".page.json");

  // Combine loaders and caches
  const modules = cached("module", moduleLoader, moduleCache);
  const manifests = cached("manifest", manifestLoader, manifestCache);
  const binaries = cached("binary", binariesLoader, cache);
  const texts = cached("text", textLoader, textCache);
  const wasmLoader = Loader.transform(decompress, binaries);
  const wasm = cached("wasm", wasmLoader, wasmCache);
  const programs = cached("program", programLoader, programCache);
  const templates = cached("template", templateLoader, templateCache);
  const values = cached("values", valuesLoader, valuesCache);
  const roots = cached("root", rootLoader, rootCache);
  const editors = cached("editor", editorLoader, editorCache);
  const pages = cached("page", pageLoader, pageCache);

  // Create cache manager for invalidation.
  const manager = Storage.manager([
    moduleCache,
    manifestCache,
    valuesCache,
    wasmCache,
    textCache,
    editorCache,
    programCache,
    templateCache,
    rootCache,
    pageCache,
  ]);

  return context;
}
