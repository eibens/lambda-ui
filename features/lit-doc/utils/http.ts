export function resolve(routes: Record<string, unknown>, path: string) {
  const entries: Record<string, {
    key: string;
    value: unknown;
    path: string;
  }> = {};

  for (const [key, value] of Object.entries(routes)) {
    const endIndex = key.lastIndexOf(".");
    const name = key.substring(0, endIndex);
    if (("/" + name).endsWith("/index")) {
      const subName = name.substring(0, name.length - "/index".length);
      entries[subName] = {
        key,
        value,
        path,
      };
    } else {
      entries[name] = {
        key,
        value,
        path,
      };
    }
  }

  return entries[path];
}
