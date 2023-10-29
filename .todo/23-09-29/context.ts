import type * as Lit from "litdoc/lit.ts";
import * as Editor from "./editor.ts";
import * as Markdown from "./markdown.ts";
import * as Swc from "./swc.ts";

/** MAIN **/

export type Result<T> = {
  status: "resolved";
  value: T;
} | {
  status: "rejected";
  error: Error;
} | {
  status: "pending";
  promise: Promise<T>;
} | {
  status: "empty";
};

export type ResultMap<T> = {
  [K in keyof T]: Result<T[K]>;
};

export type Binary = {
  compressed: Uint8Array;
  buffer: Uint8Array;
};

export type AssetMap = {
  module: unknown;
  manifest: Lit.Manifest;
  values: Lit.Value[];
  text: string;
  program: Swc.Program;
  template: string;
  root: Markdown.Root;
  editor: Editor.LitdocEditor;
  page: Editor.Page;
};

export type CompilerResult = ResultMap<AssetMap>;

export type Compiler = {
  compile: (key: string) => ResultMap<AssetMap>;
};

export function getResult<T>(result: Result<T>): Promise<T> {
  return result.promise;
}

export function awaitResultMap<T>(resultMap: ResultMap<T>): T {
  const entries = Object.entries(resultMap) as [keyof T, Result<T[keyof T]>][];
  const values = entries.map(([_, result]) => awaitResult(result));
  return Object.fromEntries(values) as T;
}
