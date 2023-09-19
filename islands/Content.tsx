import { client } from "litdoc/client.ts";
import { Doc } from "litdoc/components/Doc.tsx";
import { Route } from "litdoc/utils/route.ts";
import manifest from "../litdoc.gen.ts";

export default function Content(props: {
  route: Route;
}) {
  const { route } = props;

  const litdoc = client({
    modules: manifest.routes,
  });

  return (
    <Doc
      root={route.root}
      values={litdoc.getValues(route.file)}
    />
  );
}
