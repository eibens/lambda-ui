import { assertEquals } from "$std/assert/assert_equals.ts";
import { concurrent, fromKv, Loader, memoized, Storage } from "./mod.ts";

const kv = await Deno.openKv();

async function createKv(
  loader: Loader<string>,
  storage: Storage<string> = new Map(),
) {
  const prefix: Deno.KvKey = ["litdoc/cache/kv_test"];

  // add initial to storage
  for (const [key, entry] of storage) {
    await kv.set(
      [...prefix, key],
      JSON.stringify({
        version: entry.version,
        value: JSON.stringify(entry.value),
      }),
    );
  }

  return fromKv(loader, kv, {
    prefix,
  });
}

function createMemory(
  loader: Loader<string>,
  storage: Storage<string> = new Map(),
) {
  return Promise.resolve(memoized(loader, storage));
}

const implementations = [{
  title: "kv",
  create: createKv,
}, {
  title: "memory",
  create: createMemory,
}];

for (const { title, create } of implementations) {
  Deno.test(`${title} does not load value if version is the same`, async () => {
    const load = await create(
      () => {
        throw new Error("should not be called");
      },
      new Map(
        [["foo", { version: 42, value: "bar" }]],
      ),
    );

    const value = await load("foo", 42);
    assertEquals(value, "bar");
  });

  Deno.test(`${title} loads value if version is different`, async () => {
    const load = await create(
      () => Promise.resolve("baz"),
      new Map(
        [["foo", { version: 42, value: "bar" }]],
      ),
    );

    const value = await load("foo", 43);
    assertEquals(value, "baz");
  });

  Deno.test(`${title} loads value if not in cache`, async () => {
    const load = await create(() => Promise.resolve("baz"), new Map());

    const value = await load("foo", 43);
    assertEquals(value, "baz");
  });

  Deno.test(`${title} loads correct value for different versions of the same key`, async () => {
    const load = await create(
      () => Promise.resolve("newBaz"),
      new Map(
        [["foo", { version: 42, value: "oldBar" }]],
      ),
    );

    const oldValue = await load("foo", 42);
    assertEquals(oldValue, "oldBar");

    const newValue = await load("foo", 43);
    assertEquals(newValue, "newBaz");
  });

  Deno.test(`${title} handles concurrent access`, async () => {
    let loads = 0;
    let resolve = (_: string | PromiseLike<string>): void => {
      throw new Error("should not be called");
    };

    const promise = new Promise<string>((r) => {
      resolve = r;
    });

    const load = concurrent(
      await create(
        () => {
          loads++;
          return promise;
        },
        new Map(),
      ),
    );

    const promises = [
      load("foo", 42),
      load("foo", 42),
      load("foo", 42),
    ];

    resolve("baz");

    const values = await Promise.all(promises);
    assertEquals(values, ["baz", "baz", "baz"]);
    assertEquals(loads, 1);
  });
}
