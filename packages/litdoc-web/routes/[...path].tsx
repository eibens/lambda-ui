import { RouteContext } from "$fresh/server.ts";
import { Head } from "$fresh/src/runtime/head.ts";
import * as Litdoc from "litdoc/mod.ts";
import * as LitdocTheme from "litdoc/theme/mod.ts";
import { View } from "litdoc/ui/mod.ts";
import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import * as Example from "../example.tsx";

/** MAIN **/

export default async function render(ctx: RouteContext) {
  const { params } = ctx;
  const { path = "" } = params;

  const litdoc = Litdoc.create();

  litdoc.setModules({
    "./example.tsx": Example,
  });

  const doc = await litdoc.getDoc("./example.tsx");
  const editor = withReact(createEditor());
  const editable = LitdocTheme.create();

  return (
    <>
      <Head>
        <title>{path}</title>
        <link href="/fontawesome/css/fontawesome.min.css" rel="stylesheet" />
        <link href="/fontawesome/css/solid.min.css" rel="stylesheet" />
        <link href="/fontawesome/css/brands.min.css" rel="stylesheet" />
        <link href="/fontawesome/css/regular.min.css" rel="stylesheet" />
      </Head>
      <View
        class="flex justify-center"
        id="top"
      >
        <View class="my-32 px-6 w-full max-w-3xl">
          <Slate
            editor={editor}
            initialValue={[doc]}
          >
            <Editable
              style={{
                padding: "16px",
              }}
              {...editable}
            />
          </Slate>
        </View>
      </View>
    </>
  );
}
