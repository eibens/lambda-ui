import { Head } from "$fresh/src/runtime/head.ts";
import { PageProps } from "$fresh/src/server/types.ts";
import { View } from "@/features/theme/mod.ts";
import Feature from "@/islands/feature.tsx";
import FeatureHeader from "@/islands/feature_header.tsx";
import * as Manifest from "@lambda-ui/manifest";
import manifest from "../litdoc.gen.ts";

/** MAIN **/

export default function render(props: PageProps) {
  const { params } = props;

  const path = Manifest.route(
    Object.keys(manifest.routes),
    "./" + params.path,
  );

  return (
    <>
      <Head>
        <title>@lambda-ui</title>
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
          <Feature path={path} />
        </View>
      </View>
    </>
  );
}
