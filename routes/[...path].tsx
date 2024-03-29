import { Head } from "$fresh/src/runtime/head.ts";
import { PageProps } from "$fresh/src/server/types.ts";
import * as Manifest from "@litdoc/manifest";
import { View } from "@litdoc/ui";
import Doc from "../islands/Doc.tsx";
import FeatureHeader from "../islands/FeatureHeader.tsx";
import manifest from "../litdoc.gen.ts";

/** MAIN **/

export default function render(props: PageProps) {
  const { params } = props;

  const path = Manifest.route(
    Object.keys(manifest.routes),
    params.path.length ? "./" + params.path : ".",
  );

  const content = path ? <Doc path={path} /> : <View>404 - Not Found</View>;

  return (
    <>
      <Head>
        <title>Litdoc</title>
        <link href="/fontawesome/css/fontawesome.min.css" rel="stylesheet" />
        <link href="/fontawesome/css/solid.min.css" rel="stylesheet" />
        <link href="/fontawesome/css/brands.min.css" rel="stylesheet" />
        <link href="/fontawesome/css/regular.min.css" rel="stylesheet" />
      </Head>
      <View
        class="flex justify-center"
        id="top"
      >
        <FeatureHeader
          name={path ?? "Not found"}
        />
        <View class="my-32 px-6 w-full max-w-3xl">
          {content}
        </View>
      </View>
    </>
  );
}
