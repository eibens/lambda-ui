import { RouteContext } from "$fresh/server.ts";
import { Head } from "$fresh/src/runtime/head.ts";
import * as docs from "../docs.ts";
import Content from "../islands/Content.tsx";
import * as Kernel from "../src/kernel.ts";
import { Meta } from "../src/theme.ts";

/** MAIN **/

export default async function render(_: Request, ctx: RouteContext) {
  const { params } = ctx;
  const path = "/" + (params.path ?? "");
  const kernel = Kernel.create(docs.doc(), {
    storage: "disk",
  });
  const route = Kernel.route(kernel, path);

  if (!route) {
    return new Response("Not Found", { status: 404 });
  }

  const bundle = await Kernel.bundle(kernel, route.key);
  const page = bundle.pages[route.key];

  return (
    <>
      <Head>
        <title>{page.title}</title>
        <Meta />
      </Head>
      <Content bundle={bundle} path={path} />
    </>
  );
}
