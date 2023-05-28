import { fromFileUrl } from "https://deno.land/std@0.159.0/path/mod.ts";
import {
  Application,
  httpErrors,
  send,
} from "https://deno.land/x/oak@v11.1.0/mod.ts";

export async function start(root: URL) {
  const app = new Application();

  app.use(async (ctx) => {
    try {
      await send(ctx, ctx.request.url.pathname, {
        root: fromFileUrl(root),
        index: "index.html",
      });
    } catch (error) {
      if (error instanceof httpErrors.NotFound) {
        ctx.response.status = 404;
        ctx.response.body = "Not Found";
      }
    }
  });

  console.log("Server running on http://localhost:8000");

  await app.listen({ port: 8000 });
}
