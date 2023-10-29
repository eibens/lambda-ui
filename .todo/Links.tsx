import { Client } from "../client.ts";
import { md } from "../markdown.ts";

/** HELPERS **/

type ListProps = {
  items: ItemProps[];
};

type ItemProps = {
  href: string;
  title: string;
  icon: string;
};

const Item = ({ href, title, icon }: ItemProps) =>
  md`- :^icons/${icon}: [${title}](${href})\n`;

const render = ({ items }: ListProps) =>
  md`
> #### Links on this page
> 
> ${items.map(Item)}`;

/** MAIN **/

export function renderLinkList(client: Client, path: string) {
  const page = client.getPage(path);
  return render({
    items: page.relations.map((rel) => {
      const linkedPage = client.getPage(rel);
      return {
        href: rel.path,
        title: linkedPage.title ?? "Untitled",
        icon: linkedPage.icon ?? "minus",
      };
    }),
  });
}
