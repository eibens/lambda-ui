import type { BaseElement, BaseText } from "@lambda-ui/lit-doc";

/** MAIN **/

export type Schema = {
  // text
  inlineCode: BaseText;
  plain: BaseText;

  // elements
  blockquote: BaseElement;
  listItem: BaseElement;
  thematicBreak: BaseElement;
  emphasis: BaseElement;
  strong: BaseElement;
  delete: BaseElement;
  paragraph: BaseElement & {
    isLead?: boolean;
  };
  heading: BaseElement & {
    depth: 1 | 2 | 3 | 4 | 5 | 6;
    slug?: string;
  };
  list: BaseElement & {
    ordered?: boolean;
  };
  code: BaseElement & {
    lang?: string;
  };
  link: BaseElement & {
    url: string;
  };
  linkReference: BaseElement & {
    label: string;
    identifier: string;
    referenceType: string;
  };
  space: {
    height: number;
  };
};
