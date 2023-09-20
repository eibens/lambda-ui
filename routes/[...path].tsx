import Content from "$/islands/Content.tsx";
import * as manifest from "$/litdoc.ts";
import { RouteContext } from "$fresh/server.ts";
import { Head } from "$fresh/src/runtime/head.ts";
import { Meta } from "litdoc/components/Meta.tsx";
import { View } from "litdoc/components/View.tsx";
import { server } from "litdoc/server.ts";

/** MAIN **/

export default async function render(_: Request, ctx: RouteContext) {
  const { params } = ctx;
  const { path = "docs/index.md" } = params;

  const litdoc = server();
  const route = await litdoc.route(manifest, path);

  return (
    <>
      <Head>
        <title>{route.title}</title>
        <Meta />
      </Head>
      <View
        class="flex justify-center"
        id="top"
      >
        <View class="my-32 px-6 w-full max-w-3xl">
          <Content route={route} />
        </View>
      </View>
    </>
  );
}
