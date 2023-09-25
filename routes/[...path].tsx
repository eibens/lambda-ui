import { RouteContext } from "$fresh/server.ts";
import { Head } from "$fresh/src/runtime/head.ts";
import * as docs from "../docs.ts";
import Content from "../islands/Content.tsx";
import * as Kernel from "../src/kernel.ts";
import { Meta, View } from "../src/theme.ts";

/** MAIN **/

export default async function render(_: Request, ctx: RouteContext) {
  const { params } = ctx;
  const path = "/" + (params.path ?? "");
  const kernel = Kernel.create(docs.doc(), {
    storage: "disk",
  });
  const key = Kernel.route(kernel, path);
  const bundle = await Kernel.bundle(kernel, key);
  const page = bundle.pages[key];
  return (
    <>
      <Head>
        <title>{page.title}</title>
        <Meta />
      </Head>
      <View
        class="flex justify-center"
        id="top"
      >
        <View class="my-32 px-6 w-full max-w-3xl">
          <Content bundle={bundle} path={path} />
        </View>
      </View>
    </>
  );
}
