import renderPath from "./[...path].tsx";
import { RouteContext } from "$fresh/server.ts";

export default async function render(req: Request, ctx: RouteContext) {
  return await renderPath(
    req,
    Object.assign(ctx, {
      params: {},
    }),
  );
}
