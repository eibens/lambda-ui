import * as components from "../components/mod.ts";
import { fromComponents } from "./render.tsx";

export function create() {
  return fromComponents(components);
}
