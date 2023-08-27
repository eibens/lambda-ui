import { Head } from "$fresh/src/runtime/head.ts";
import { PageProps } from "$fresh/src/server/types.ts";
import litdoc from "litdoc/mod.ts";
import { View } from "litdoc/view/mod.ts";
import manifest from "../litdoc.gen.ts";

/** MAIN **/

export default function render(props: PageProps) {
  const { params } = props;
  const { path = "" } = params;

  const instance = litdoc({
    manifest: manifest.routes,
  });

  return (
    <>
      <Head>
        <title>{path}</title>
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
          <h1 class="text-4xl font-bold">{path}</h1>
          <p>Hello world</p>
        </View>
      </View>
    </>
  );
}
