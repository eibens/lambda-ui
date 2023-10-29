import { MiddlewareHandlerContext } from "$fresh/server.ts";
import * as Dark from "../src/dark.ts";

export const handler = [
  async (req: Request, ctx: MiddlewareHandlerContext) => {
    Dark.setFromRequest(req);
    return await ctx.next();
  },
];
