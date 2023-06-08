import { Markdown, MarkdownProvider, md } from "../markdown/mod.ts";
import MonacoExample from "../monaco/example.tsx";
import { TwindProvider } from "../theme/twind_provider.tsx";
import { Layout } from "../widgets/layout.tsx";

/** MAIN **/

const root = md`
# Lambda UI

This is Lukas Eibensteiner's personal UI library.
It strives to be isomorphic in react and preact.

---

${<MonacoExample />}
`;

export function App() {
  return (
    <TwindProvider>
      <Layout title="Lambda UI">
        <MarkdownProvider>
          <Markdown root={root} />
        </MarkdownProvider>
      </Layout>
    </TwindProvider>
  );
}
