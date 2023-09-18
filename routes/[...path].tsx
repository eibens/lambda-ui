import { RouteContext } from "$fresh/server.ts";
import { Head } from "$fresh/src/runtime/head.ts";
import { View } from "litdoc/components/View.tsx";
import { server } from "litdoc/server.ts";
import { logText } from "litdoc/utils/log.ts";
import Doc from "../islands/Doc.tsx";
import manifest from "../litdoc.gen.ts";

/** MAIN **/

export default async function render(_: Request, ctx: RouteContext) {
  const { params } = ctx;
  const { path = "" } = params;

  const litdoc = server({
    modules: manifest.routes,
  });

  const library = await litdoc.getLibrary();

  const libraryJson = JSON.stringify(library);
  logText(`library has ${libraryJson.length} bytes`);

  const file = "./" + (path || "docs/index.md");

  if (!litdoc.hasModule(file)) {
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="crossorigin"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&family=Roboto+Serif:ital,opsz,wght@0,8..144,500;1,8..144,500&family=Roboto:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
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
