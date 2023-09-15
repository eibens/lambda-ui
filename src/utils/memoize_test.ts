import { assertEquals } from "$std/assert/assert_equals.ts";
import { Loader, memoize, Storage } from "litdoc/utils/memoize.ts";

function create(
  loader: Loader<string>,
  storage: Storage<string> = new Map(),
) {
  return memoize(loader, storage);
}

Deno.test(`memoized does not load value if version is the same`, async () => {
  const load = create(
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

Deno.test(`memoized loads value if version is different`, async () => {
  const load = create(
    () => Promise.resolve("baz"),
    new Map(
      [["foo", { version: 42, value: "bar" }]],
    ),
  );

  const value = await load("foo", 43);
  assertEquals(value, "baz");
});

Deno.test(`memoized loads value if not in cache`, async () => {
  const load = create(() => Promise.resolve("baz"), new Map());

  const value = await load("foo", 43);
  assertEquals(value, "baz");
});

Deno.test(`memoized loads correct value for different versions of the same key`, async () => {
  const load = create(
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

Deno.test(`memoized handles concurrent access`, async () => {
  let loads = 0;
  let resolve = (_: string | PromiseLike<string>): void => {
    throw new Error("should not be called");
  };

  const promise = new Promise<string>((r) => {
    resolve = r;
  });

  const load = create(
    () => {
      loads++;
      return promise;
    },
    new Map(),
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
