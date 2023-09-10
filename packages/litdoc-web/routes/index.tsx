import { RouteContext } from "$fresh/server.ts";
import renderPath from "./[...path].tsx";

export default async function render(ctx: RouteContext) {
  return await renderPath(Object.assign(ctx, {
    params: {
      path: "",
    },
  }));
}
