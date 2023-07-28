/** MAIN **/

export type Pair<T = number> = [T, T];

export type PairInit<T = number> = T | Pair<T>;

export function from<T>(value: PairInit<T>): Pair<T> {
  return Array.isArray(value) ? value : [value, value];
}

export function swap<T>(pair: Pair<T>, force = true): Pair<T> {
  const [a, b] = pair;
  return force ? [b, a] : pair;
}

export function fromZero(value: number): Pair {
  return [0, value];
}

export function contains([min, max]: Pair, value: number) {
  return value >= min && value <= max;
}

export function empty([min, max]: Pair) {
  return min === max;
}

export function clamp([min, max]: Pair, value: number) {
  return Math.max(min, Math.min(max, value));
}

export function extent(ticks: number[]): Pair {
  const sorted = ticks;
  const min = sorted[0] ?? 0;
  const max = sorted[sorted.length - 1] ?? 0;
  const offset = min === max ? 1 : 0;
  return [min - offset, max + offset] as Pair;
}

export function linear(domain: Pair, range: Pair) {
  const [a, b] = domain;
  const [c, d] = range;
  const ab = b - a;
  const s = (d - c) / ab;
  const t = a * (c - d) / ab + c;
  return (x: number, w = 1) => x * s + w * t;
}

export function inset(range: Pair, amount: PairInit): Pair {
  const [x0, x1] = range;
  const [m0, m1] = from(amount);
  return [x0 + m0, x1 - m1];
}

export function insetEmpty(pair: Pair, amount: PairInit): Pair {
  return empty(pair) ? inset(pair, amount) : pair;
}

export function position(pair: Pair, pos: number) {
  const [min, max] = pair;
  if (pos <= min) return "min";
  if (pos >= max) return "max";
  return "mid";
}
