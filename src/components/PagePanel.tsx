import * as LitdocEditor from "../editor.ts";
import { md, parse, weave } from "../template.ts";
import { Bundle, Kernel, Page, Value } from "../types.ts";
import { Blockquote } from "./Blockquote.tsx";
import { Theme } from "./Theme.tsx";

type RenderProps = {
  links: {
    href: string;
    title: string;
    icon: string;
  }[];
};

const render = (props: RenderProps) =>
  md`
#### Links on this page

${
    props.links.map(({ icon, href, title }) => {
      return md`- :^icons/${icon}: [${title}](${href})\n`;
    })
  }
`;

export function PagePanel(props: {
  kernel: Kernel;
  bundle: Bundle;
  page: Page;
}) {
  const { page, bundle } = props;

  const call = render({
    links: page.relations.map((rel) => {
      const linkedPage = bundle.pages[rel.key];
      return {
        href: rel.path,
        title: linkedPage.title ?? "Untitled",
        icon: linkedPage.icon ?? "minus",
      };
    }),
  });

  const [template, ...values] = weave(call.args);
  const root = parse(template);

  const valueMap = values.reduce(
    (acc, value, i) => (acc[i] = value, acc),
    {} as Record<string, Value>,
  );

  const editor = LitdocEditor.create(root, valueMap);

  return (
    <Blockquote>
      <Theme
        editor={editor}
      />
    </Blockquote>
  );
}
