import { MiddlewareHandlerContext } from "$fresh/server.ts";
import * as Dark from "litdoc/services/dark.ts";

export const handler = [
  async (req: Request, ctx: MiddlewareHandlerContext) => {
    Dark.setFromRequest(req);
    return await ctx.next();
  },
];
