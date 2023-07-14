import { BaseEditor } from "slate";

export function withLitDoc<E extends BaseEditor>(editor: E): E {
  return editor;
}
