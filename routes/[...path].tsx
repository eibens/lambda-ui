import { Head } from "$fresh/src/runtime/head.ts";
import { PageProps } from "$fresh/src/server/types.ts";
import Litdoc from "litdoc/mod.ts";
import { View } from "litdoc/view/mod.ts";
import * as Example from "../example.tsx";

/** MAIN **/

export default async function render(props: PageProps) {
  const { params } = props;
  const { path = "" } = params;

  const litdoc = Litdoc.create();

  litdoc.setModules({
    "./example.tsx": Example,
  });

  console.log(await litdoc.getMarkdown("./example.tsx"));

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
