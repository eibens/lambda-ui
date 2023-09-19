import { RouteContext } from "$fresh/server.ts";
import renderPath from "./[...path].tsx";

export default async function render(req: Request, ctx: RouteContext) {
  return await renderPath(
    req,
    Object.assign(ctx, {
      params: {},
    }),
  );
}
