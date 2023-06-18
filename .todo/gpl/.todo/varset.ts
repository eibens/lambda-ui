export type Varset<X = unknown, Y = unknown> = {
  type: "varset";
  domain: Set<X>;
  range: Set<Y>;
  mapping: Map<X, Y>;
  inverse: Map<Y, Set<X>>;
};

export function range(n: number): Varset<number, number> {
  const index = new Array(n).fill(0).map((_, i) => i);
  const domain = new Set(index);
  const range = new Set(index);
  const mapping = new Map(index.map((i) => [i, i]));
  const inverse = new Map(index.map((i) => [i, new Set([i])]));
  return {
    type: "varset",
    domain,
    range,
    mapping,
    inverse,
  };
}

export function generate<X, Y>(
  index: Varset<number, X>,
  fn: (x: X) => Y,
): Varset<X, Y> {
  const domain = new Set<X>();
  const range = new Set<Y>();
  const mapping = new Map<X, Y>();
  const inverse = new Map<Y, Set<X>>();
  for (const i of index.domain) {
    const x = index.mapping.get(i)!;
    const y = fn(x);
    domain.add(x);
    range.add(y);
    mapping.set(x, y);
    if (!inverse.has(y)) {
      inverse.set(y, new Set());
    }
    inverse.get(y)!.add(x);
  }
  return {
    type: "varset",
    domain,
    range,
    mapping,
    inverse,
  };
}

export function values<T>(...values: T[]): Varset<number, T> {
  const index = new Array(values.length).fill(0).map((_, i) => i);
  const domain = new Set(index);
  const range = new Set(values);
  const mapping = new Map(index.map((i) => [i, values[i]]));
  const inverse = new Map(values.map((v) => [v, new Set<number>()]));

  for (const i of index) {
    const v = values[i];
    inverse.get(v)!.add(i);
  }

  return {
    type: "varset",
    domain,
    range,
    mapping,
    inverse,
  };
}
