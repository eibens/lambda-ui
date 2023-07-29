import { Head } from "$fresh/src/runtime/head.ts";
import { PageProps } from "$fresh/src/server/types.ts";
import Content from "@/islands/content.tsx";
import FeatureHeader from "@/islands/feature_header.tsx";
import * as Manifest from "@litdoc/manifest";
import { View } from "@litdoc/ui";
import manifest from "../litdoc.gen.ts";

/** MAIN **/

export default function render(props: PageProps) {
  const { params } = props;

  const path = Manifest.route(
    Object.keys(manifest.routes),
    "./" + params.path,
  );

  const content = path ? <Content path={path} /> : <View>404 - Not Found</View>;

  return (
    <>
      <Head>
        <title>Litdoc</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap"
        />
      </Head>
      <View class="flex justify-center" id="top">
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
