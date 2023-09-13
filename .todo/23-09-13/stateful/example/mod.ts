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
