import * as Swc from "litdoc/swc/mod.ts";

export async function parseAst(options: {
  file: string;
  source: string;
  hash: string;
  cache: Deno.Kv;
}): Promise<Swc.Program> {
  const { file, source, hash, cache } = options;

  const key = ["litdoc-swc-cache", file];
  const entry = await cache.get<string>(key);

  if (entry.versionstamp !== null) {
    const data = JSON.parse(entry.value) as {
      hash: string;
      payload: string;
    };

    if (data.hash === hash) {
      console.log(`SWC cache hit: ${file} #${hash.slice(0, 8)}...`);
      return JSON.parse(data.payload);
    }
  }

  // NOTE: Must reload SWC for every parse operation.
  // Otherwise, the spans accumulate.
  const parse = await Swc.create();

  const ast = parse(source, {
    syntax: "typescript",
  });

  const data = JSON.stringify({
    hash,
    payload: JSON.stringify(ast),
  });

  console.log(`SWC cache miss: ${file} #${hash.slice(0, 8)}...`);
  await cache.set(key, data);
  return ast;
}
