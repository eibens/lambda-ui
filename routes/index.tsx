import { lit } from "@/components/lit.tsx";
import { Page } from "@/components/page.tsx";
import { Content } from "../components/content.tsx";

/** MAIN **/

const { md, editor } = lit();

export default function render() {
  return (
    <Page>
      <Content editor={editor} />
    </Page>
  );
}

md`
# Lambda UI

This is Lukas Eibensteiner's personal UI library.
It is built for TypeScript, Preact, and Deno.

- [monaco](/monaco)
`;
