// routes/_middleware.ts
import { MiddlewareHandlerContext } from "$fresh/server.ts";

export let COOKIES: Record<string, string> = {};

async function initCookies(req: Request, ctx: MiddlewareHandlerContext) {
  // cookies
  const cookies = req.headers.get("cookie");
  if (cookies) {
    COOKIES = cookies.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.split("=");
      acc[key.trim()] = value.trim();
      return acc;
    }, {} as Record<string, string>);
  }

  return await ctx.next();
}

export const handler = [
  initCookies,
];
