import { md } from "../markdown/mod.ts";
import { TwindProvider } from "../theme/twind_provider.tsx";
import { Layout } from "./layout.tsx";

/** MAIN **/

const root = md`
# Lambda UI

> TODO: Add some examples.
`;

export function App() {
  return (
    <TwindProvider>
      <Layout root={root} />
    </TwindProvider>
  );
}
