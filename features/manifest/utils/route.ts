export function route(paths: string[], path: string) {
  const entries: Record<string, string> = {};

  for (const key of paths) {
    const endIndex = key.lastIndexOf(".");
    const name = key.substring(0, endIndex);
    if (("/" + name).endsWith("/index")) {
      const subName = name.substring(0, name.length - "/index".length);
      entries[subName] = key;
    } else {
      entries[name] = key;
    }
  }

  return entries[path];
}
