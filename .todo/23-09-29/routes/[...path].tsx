import { RouteContext } from "$fresh/server.ts";
import { Head } from "$fresh/src/runtime/head.ts";
import { doc } from "../docs.ts";
import Content from "../islands/Content.tsx";

/** MAIN **/

const server = Server.create(doc());

export default async function render(_: Request, ctx: RouteContext) {
  const { params } = ctx;

  const { path } = params;
  const key = server.getKey(params.path);

  if (!key) {
    return new Response("Not Found", { status: 404 });
  }

  const page = await server.getPage(key);
  const bundle = await server.getBundle(key);
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
