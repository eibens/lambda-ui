import { RouteContext } from "$fresh/server.ts";
import { Head } from "$fresh/src/runtime/head.ts";
import * as Litdoc from "litdoc/mod.ts";
import { View } from "litdoc/ui/mod.ts";
import Doc from "../islands/Doc.tsx";
import manifest from "../litdoc.gen.ts";

/** MAIN **/

export default async function render(_: Request, ctx: RouteContext) {
  const { params } = ctx;
  const { path = "" } = params;

  const litdoc = Litdoc.server({
    modules: manifest.routes,
  });

  const library = await litdoc.getLibrary();

  const libraryJson = JSON.stringify(library);
  console.log(`library has ${libraryJson.length} bytes`);

  const file = "./" + (path || "docs/index.tsx");
  console.log(path, file);

  if (!litdoc.has(file)) {
    return ctx.renderNotFound();
  }

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>{path}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="/fontawesome/css/fontawesome.min.css" rel="stylesheet" />
        <link href="/fontawesome/css/solid.min.css" rel="stylesheet" />
        <link href="/fontawesome/css/brands.min.css" rel="stylesheet" />
        <link href="/fontawesome/css/regular.min.css" rel="stylesheet" />
      </Head>

      <View
        class="flex justify-center"
        id="top"
      >
        <View class="my-32 px-6 w-full max-w-3xl">
          <Doc
            file={file}
            library={library}
          />
        </View>
      </View>
    </>
  );
}
