export async function write(path: string | URL, source: string, options: {
  /**
   * Only writes file if the current content is different from the next.
   *
   * This is useful for preventing infinite rebuilds with `--watch`.
   */
  lazy?: boolean;
} = {}) {
  if (options.lazy) {
    try {
      const current = await Deno.readTextFile(path);
      if (current === source) return;
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) throw error;
    }
  }

  await Deno.writeTextFile(path, source);
}
