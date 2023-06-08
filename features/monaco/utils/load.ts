import { Monaco, MONACO_DEFAULT_PATH } from "./types.ts";

/** MAIN **/

export function load(options?: {
  path?: string;
}) {
  const { path = MONACO_DEFAULT_PATH } = options ?? {};

  const src = `${path}/loader.js`;
  const selector = `script[src="${src}"]`;
  if (document.querySelector(selector)) {
    throw new Error("Monaco loader already initiated.");
  }

  const script = document.createElement("script");
  script.src = src;
  document.body.appendChild(script);

  return new Promise<Monaco>((resolve, reject) => {
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
}
