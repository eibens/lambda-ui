/** HELPERS **/

let PRIVATE_STATE: Element | null = null;

function set(state: Element | null) {
  PRIVATE_STATE = state;
}

function use(): Element {
  if (PRIVATE_STATE === null) {
    throw new Error("Context not initialized");
  }
  return PRIVATE_STATE;
}

function proxy<T, K extends string = string>(fn: (key: K) => T): Record<K, T> {
  return new Proxy({}, {
    get: (_, key) => fn(key as K),
  }) as Record<K, T>;
}

/** MAIN **/

export type Element = {
  type: string;
  name: string;
  props:
  children: Children;
};

export type Atom =
  | number
  | boolean
  | string
  | null
  | undefined;

export type Node =
  | Element
  | Atom;

export type Children = Node[];

export type Func = (...children: Children) => Element;

// deno-lint-ignore no-explicit-any
export type Resolver = (...values: any[]) => any;

export type Tag = (...children: Children) => void;

export function isAtom(value: unknown): value is Atom {
  return typeof value !== "object" || value == null;
}

export function isElement(value: unknown): value is Element {
  return typeof value === "object" && value != null && "type" in value;
}

export function isNode(value: unknown): value is Node {
  return isAtom(value) || isElement(value);
}

export function hasName(value: unknown, name: string): value is Element {
  return isElement(value) && value.name === name;
}

export function ref(name: string): Element {
  return { type: "ref", name, children: [] };
}

export function func(name: string): Func {
  return (...children) => {
    return { type: "func", name, children };
  };
}

export function tag(name: string) {
  return (...children: Element[]) => {
    const state = use();
    state.children = state.children ?? [];
    state.children.push({ type: "tag", name, children });
  };
}

export function create(fn: () => void) {
  const ctx = {
    type: "root",
    name: "root",
    children: [],
  };
  set(ctx);
  fn();
  set(null);
  return ctx;
}

export const refs = proxy(ref);

export const funcs = proxy(func);

export const tags = proxy(tag);

export const $ = {
  atom: isAtom,
  node: isNode,
  element: isElement,
  name: (name: string) => (value: unknown): value is Element =>
    hasName(value, name),
};
