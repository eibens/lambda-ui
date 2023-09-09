import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { Dark } from "litdoc/ui/mod.ts";

export const handler = [
  async (req: Request, ctx: MiddlewareHandlerContext) => {
    Dark.setFromRequest(req);
    return await ctx.next();
  },
];
