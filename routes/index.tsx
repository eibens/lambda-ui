import { Handlers, PageProps } from "$fresh/server.ts";
import { lit } from "@/components/lit.tsx";
import { Page } from "@/components/page.tsx";
import { Content } from "../components/content.tsx";
import * as library from "../features/mod.ts";

/** HELPERS **/

const { md, editor } = lit<Props>();

md`
# \`@lambda-ui\`

This is Lukas Eibensteiner's personal UI library.
It is built for TypeScript, Preact, and Deno.

## Features

The \`features\` folders export the API of the library.
The following features are available:

${(props) =>
  props.data.features.map(({ name }) => {
    return `- [${name}](/${name})\n`;
  }).join("\n")}
`;

/** MAIN **/

export type Data = {
  features: {
    name: string;
  }[];
};

export type Props = PageProps<Data>;

export const handler: Handlers = {
  GET: (_, ctx) => {
    const data: Data = {
      features: Object.keys(library)
        .map((name) => ({ name })),
    };

    return ctx.render(data);
  },
};

export default function render(props: Props) {
  return (
    <Page>
      <Content editor={editor(props)} />
    </Page>
  );
}
