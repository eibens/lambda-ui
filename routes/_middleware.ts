import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { setFromRequest } from "litdoc/dark/mod.ts";

export const handler = [
  async (req: Request, ctx: MiddlewareHandlerContext) => {
    setFromRequest(req);
    return await ctx.next();
  },
];
