import { signal } from "@preact/signals-core";
import { Monaco } from "./types.ts";

let promise: Promise<Monaco> | undefined;

/** MAIN **/

/**
 * Signal that emits the Monaco Editor instance as soon as it is loaded.
 */
export const store = signal<Monaco | undefined>(undefined);

export const DEFAULT_PATH =
  "https://cdn.jsdelivr.net/npm/monaco-editor@0.36.1/min/vs";

/**
 * Load Monaco Editor files and return the instance.
 *
 * If the files are already loaded, it returns the instance immediately.
 *
 * It uses jsdeliver.net as a CDN by default, but you can specify a different
 * path if you want to host the files yourself.
 *
 * @param options.path Path to the Monaco Editor files.
 */
export function load(options?: {
  path?: string;
}) {
  const { path = DEFAULT_PATH } = options ?? {};

  if (promise) {
    return promise;
  }

  const src = `${path}/loader.js`;
  const script = document.createElement("script");
  script.src = src;
  document.body.appendChild(script);

  promise = new Promise<Monaco>((resolve, reject) => {
    script.onload = () => {
      const require = Reflect.get(window, "require");

      require.config({
        paths: {
          vs: path,
        },
      });

      require(
        ["vs/editor/editor.main"],
        (instance: Monaco) => {
          store.value = instance;
          resolve(instance);
        },
        (error: Error) => {
          reject(error);
        },
      );
    };

    script.onerror = () => {
      reject(new Error("Failed to load Monaco loader script."));
    };
  });

  return promise;
}
