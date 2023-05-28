import {
  dirname,
  fromFileUrl,
} from "https://deno.land/std@0.159.0/path/mod.ts";
import * as es from "https://deno.land/x/esbuild@v0.15.10/mod.js";
import { denoPlugin } from "https://deno.land/x/esbuild_deno_loader@0.6.0/mod.ts";
import { render } from "../build/mod.ts";

async function renderReact(options: {
  source: URL;
  output: URL;
  outputCss: URL;
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

  const view = await exports.render();
  const { html, css } = render(view);

  await Deno.mkdir(
    dirname(fromFileUrl(output)),
    { recursive: true },
  );

  await Deno.writeTextFile(
    fromFileUrl(new URL(output)),
    html,
  );

  await Deno.writeTextFile(
    fromFileUrl(new URL("./index.css", output)),
    css,
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
    jsxImportSource: "preact",
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
        importMapURL: new URL("../../import_map.json", source),
      }),
    ],
  });
}

export async function build(output: URL) {
  const source = new URL(import.meta.url);

  await renderReact({
    source: new URL("./index.html.tsx", source),
    output: new URL("./index.html", output),
    outputCss: new URL("./index.css", output),
  });

  await esbuild({
    source: new URL("./index.tsx", source),
    output: new URL("./index.js", output),
  });
}
