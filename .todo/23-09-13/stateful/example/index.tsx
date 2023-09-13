import { Signal, signal } from "@preact/signals";
import lit from "./app.ts";
import { add, decrement, increment, State } from "./mod.ts";

export const app = lit<State>(0);
const { md, fn } = app;
const amount = signal(5);

md`
# :^icon/plus: Counter App

This is a simple counter app built with Litdoc.

> :${increment}: ${current} :${decrement}:
> :${[add, 10]}: :${[add, 50]}: :${[add, 100]}:
> Or add a custom amount: :${add}:
`;

fn(decrement)`
# :^icon/arrow-down: Decrement

Subtracts 1 from the current value.

Using this action now will set the value 
from **${current}** 
to **${decrement}**.

> - :^icon/disabled: Disabled because the current value is 0.
> ${ifPositive(":hidden^:")}

${ifZero(":disabled^:")}
`;

fn(increment)`
# :^icon/arrow-up: Increment

Adds 1 to the current value.

Using this action now will set the value 
from **${current}** 
to **${increment}**.
`;

fn(add)`
# :^icon/plus: Add an amount

Adds an amount to the current value.

> :${<Input store={amount} />}: :${[add, amount]}:

Adding ${getAddAmount} to the current value of **${current}**
will set the value to **${add}**.
`;

function current(state: State) {
  return state;
}

function getAddAmount(_: State, amount: number) {
  return amount;
}

function ifZero(then: string) {
  return (state: State) => state === 0 && then;
}

function ifPositive(then: string) {
  return (state: State) => state > 0 && then;
}

function Input(props: {
  store: Signal<number>;
}) {
  const { store } = props;
  return (
    <input
      type="number"
      value={store}
      onInput={(e: Event) => {
        store.value = Number((e.target as HTMLInputElement).value);
      }}
    />
  );
}
