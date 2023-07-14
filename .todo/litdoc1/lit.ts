import { nanoid } from "https://esm.sh/nanoid@4.0.0";
import type { JSX } from "preact";

/** MAIN **/

export type TemplateArgs<Value> = [
  TemplateStringsArray,
  ...Value[],
];

export type Text = {
  type: "text";
  text: string;
};

export type Slot = {
  type: "slot";
  text: string;
};

export type TemplateChild =
  | Text
  | Slot;

export type Template = {
  type: "template";
  lang: string;
  children: TemplateChild[];
};

export type Lit<Props> = {
  children: Template[];
  slots: Record<string, Value<Props>>;
};

export type Value<Props> =
  // Renders to empty string.
  | undefined
  | null
  | boolean
  // Renders to string.
  | string
  | number
  // Embedded react component.
  | JSX.Element
  // Raw editor node or subtree.
  | Record<string, unknown>
  // Function returning any of the above based on input data.
  | ((props: Props, id: string) => Value<Props>)
  // An array of any of the above.
  | Value<Props>[];

export function create<Props>(): Lit<Props> {
  return {
    slots: {},
    children: [],
  };
}

export function createTag<Props>(lit: Lit<Props>, name: string) {
  return (...args: TemplateArgs<Value<Props>>): void => {
    const templateId = nanoid();
    const [strings, ...values] = args;

    const template: Template = {
      type: "template",
      lang: name,
      children: [],
    };

    for (let i = 0; i < strings.length; i++) {
      const code = strings[i];
      template.children.push({
        type: "text",
        text: code,
      });

      const value = values[i];
      if (value !== undefined) {
        const slotId = templateId + "-" + i;
        lit.slots[slotId] = value;
        template.children.push({
          type: "slot",
          text: slotId,
        });
      }
    }

    lit.children.push(template);
  };
}
