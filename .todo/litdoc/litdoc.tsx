/*import { Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import { signal } from "@preact/signals-core";

import { create, createDoc, createEditor, createTag } from "litdoc";
import { Editable, Slate } from "slate-react";
import Counter from "../islands/Counter.tsx";

function lit<Props>() {
  const state = create<Props>();
  return {
    md: createTag(state, "md"),
    df: createTag(state, "df"),
    render: (props: Props) => {
      return createDoc(state, { props });
    },
  };
}

const { md, df, render } = lit<PageProps>();

const count = signal(3);

md`
Welcome to \`lit-doc\`. Try updating this message in the
./routes/index.tsx file, and refresh.
`;

md`
Here is a constant runtime value:

Value: ${count.value}
`;

md`
Here is an interactive island:

${<Counter count={count} />}
`;

md`
This is a URL parameter:

- [Greet John](?name=John)

${(props) => {
  const url = new URL(props.url);
  const name = url.searchParams.get("name");
  return name;
}}
`;

md`
Here is an embedded node:

${{
  type: "emphasis",
  children: [{
    text: "this is emphasized text",
  }],
}}
`;

md`
Here is a code block:

~~~df
function Main() {}
~~~
`;

md`
Here is another tag:
`;

df`
function Main() {}
`;

export default function Page(props: PageProps) {
  const doc = render(props);
  const editor = createEditor(doc);
  const theme = createTheme();
  return (
    <>
      <Head>
        <title>Homepage</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <Slate
          initialValue={editor.children}
          editor={editor}
        >
          <Editable
            renderElement={theme.renderElement}
            renderLeaf={theme.renderLeaf}
          />
        </Slate>
      </div>
    </>
  );
}
*/
