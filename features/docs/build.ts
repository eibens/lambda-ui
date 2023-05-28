import {
  dirname,
  fromFileUrl,
} from "https://deno.land/std@0.159.0/path/mod.ts";
import * as es from "https://deno.land/x/esbuild@v0.15.10/mod.js";
import { denoPlugin } from "https://deno.land/x/esbuild_deno_loader@0.6.0/mod.ts";
import { renderToString } from "react-dom/server";

async function renderReact(options: {
  source: URL;
  output: URL;
}) {
  const { source, output } = options;
  const exports = await import(
    fromFileUrl(source)
  );
  if (!("render" in exports)) {
    throw new Error(
      `Expected "render" export in ${source.pathname}`,
    );
  }

  const render = exports.render;
  const view = await render();
  const html = "<!DOCTYPE html>" + renderToString(view);

  await Deno.mkdir(
    dirname(fromFileUrl(output)),
    { recursive: true },
  );

  await Deno.writeTextFile(
    fromFileUrl(new URL(output)),
    html,
  );
}

async function esbuild(options: {
  source: URL;
  output: URL;
}) {
  const { source, output } = options;
  await es.build({
    outfile: fromFileUrl(new URL("./index.js", output)),
    platform: "browser",
    jsx: "automatic",
    jsxDev: true,
    jsxImportSource: "react",
    jsxSideEffects: true,
    format: "esm",
    bundle: true,
    minify: true,
    sourcemap: true,
    watch: false,
    supported: {
      "top-level-await": true,
    },
    entryPoints: [
      fromFileUrl(new URL("./index.tsx", source)),
    ],
    plugins: [
      denoPlugin({
        importMapURL: new URL("./import_map.json", source),
      }),
    ],
  });
}

export async function build(output: URL) {
  const source = new URL(import.meta.url);

  await renderReact({
    source: new URL("./index.html.tsx", source),
    output: new URL("./index.html", output),
  });

  await esbuild({
    source: new URL("./index.tsx", source),
    output: new URL("./index.js", output),
  });
}
