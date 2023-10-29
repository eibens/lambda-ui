import type { Manifest } from "./lit.ts";

export type Resolution = {
  type: "route" | "asset";
  inferred?: boolean;
  key: string;
};

export function normalize(path: string) {
  return path ?? "/";
}

export function resolve(main: Manifest, path: string): Resolution | null {
  const module = main.routes[path];

  if (module != null) {
    for (const key in main.assets) {
      const ref = main.assets[key];
      if (ref === module) {
        return { type: "route", key };
      }
    }
  }

  return null;
}

export function resolveHref(main: Manifest, href: string) {
  function getRoute(path: string) {
    try {
      const url = new URL(path);
      return {
        url,
        target: "external" as const,
      };
    } catch (_) {
      try {
        const url = new URL(path, "http://example.com");
        return {
          url,
          target: "internal" as const,
        };
      } catch (_) {
        throw new Error(`Invalid route: ${path}`);
      }
    }
  }

  const path = getRoute(href).url.pathname;
  return resolve(main, path);
}
