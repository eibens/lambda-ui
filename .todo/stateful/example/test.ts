import { assertEquals } from "$std/assert/assert_equals.ts";

export type State = number;

export function decrement(state: State) {
  return state - 1;
}

export function increment(state: State) {
  return state + 1;
}

export function add(state: State, amount: number) {
  return state + amount;
}

Deno.test("decrement should decrement the state", () => {
  assertEquals(decrement(1), 0);
});

Deno.test("increment should increment the state", () => {
  assertEquals(increment(1), 2);
});

Deno.test("add should add the amount to the state", () => {
  assertEquals(add(1, 1), 2);
});
