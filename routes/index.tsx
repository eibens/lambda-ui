import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/src/runtime/head.ts";
import { lit } from "@/components/lit.tsx";
import { View } from "@/features/theme/mod.ts";
import HomeHeader from "@/islands/home_header.tsx";
import { Editable, Slate } from "slate-react";
import {
  Context,
  withBasicTheme,
  withTemplate,
} from "../features/lit-doc/mod.ts";
import manifest from "../lit.gen.ts";

/** HELPERS **/

const { md, doc } = lit<Props>();

md`
# [\`@lambda-ui\`](#lambda-ui)

This is Lukas Eibensteiner's personal UI library.
It is built for TypeScript, Preact, and Deno.

## Features

The \`features\` folders export the API of the library.
The following features are available:

- \`@lambda-ui/\`
${function (props) {
  return props.data.features.map(({ name, path }) => {
    return `  - [\`${name}\`](${path})\n`;
  });
}}
`;

/** MAIN **/

export type Data = {
  features: {
    name: string;
    path: string;
  }[];
};

export type Props = PageProps<Data>;

export const handler: Handlers = {
  GET: (_, ctx) => {
    const data: Data = {
      features: Object.keys(manifest.routes)
        .map((path) => ({
          name: path
            .substring("./features/".length)
            .substring(0, path.lastIndexOf("/") - 1),
          path: path
            .substring(1)
            .substring(0, path.lastIndexOf("/") - 1),
        })),
    };

    return ctx.render(data);
  },
};

export default function render(props: Props) {
  const editor = Context.create(() => {
    withTemplate(doc(props));
    withBasicTheme();
  });

  editor.normalize({ force: true });

  return (
    <>
      <Head>
        <title>@lambda-ui</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap"
        />
      </Head>
      <View class="flex justify-center" id="top">
        <HomeHeader />
        <View class="my-32 px-6 w-full max-w-3xl">
          <Slate
            editor={editor}
            initialValue={editor.children}
          >
            <Editable
              renderElement={editor.renderElement}
              renderLeaf={editor.renderLeaf}
              readOnly
            />
          </Slate>
        </View>
      </View>
    </>
  );
}
