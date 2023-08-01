export function route(paths: string[], path: string): string | undefined {
  for (const key of paths) {
    const subName = key.endsWith("/index.tsx")
      ? key.substring(0, key.length - "/index.tsx".length)
      : key;

    if (subName === path) {
      return key;
    }
  }
}
