import { Atom, Element, isAtom, Node } from "./core.ts";

/** HELPERS **/

function stringifyStatement(arg: Element) {
  const { name, children } = arg;
  return `${name}: ${children.map(stringify).join(", ")}`;
}

function stringifyAssignment(arg: Element) {
  const { name, children } = arg;
  const [lhs, rhs] = children;
  return `${name}: ${stringify(lhs)} = ${stringify(rhs)}`;
}

function stringifyFunc(arg: Element) {
  const { name, children } = arg;
  return `${name}(${children.map(stringify).join(", ")})`;
}

function stringifyAtom(arg: Atom) {
  return JSON.stringify(arg);
}

function stringifyRef(arg: Element) {
  return arg.name;
}

function stringifyRoot(arg: Element) {
  return arg.children.map(stringify).join("\n") ?? "";
}

/** MAIN **/

export function stringify(arg?: Node): string {
  if (isAtom(arg)) {
    return stringifyAtom(arg);
  }

  const { type, name } = arg;

  if (type === "ref") {
    return stringifyRef(arg);
  }

  if (type === "root") {
    return stringifyRoot(arg);
  }

  if (type === "func" || type === "tag") {
    switch (name) {
      case "DATA":
        return stringifyAssignment(arg);
      case "TRANS":
        return stringifyAssignment(arg);
      case "SCALE":
        return stringifyStatement(arg);
      case "COORD":
        return stringifyStatement(arg);
      case "ELEMENT":
        return stringifyStatement(arg);
      case "GUIDE":
        return stringifyStatement(arg);
    }
  }

  return stringifyFunc(arg);
}
