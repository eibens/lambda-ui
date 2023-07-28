export function route(paths: string[], path: string): string | undefined {
  for (const key of paths) {
    const endIndex = key.lastIndexOf(".");
    const name = key.substring(0, endIndex);
    const subName = ("/" + name).endsWith("/index")
      ? name.substring(0, name.length - "index".length) // to not trim slash
      : name;

    if (subName === path) {
      return key;
    }
  }
}
