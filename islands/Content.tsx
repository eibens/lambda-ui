import * as litdoc from "$/litdoc.ts";
import { Doc } from "litdoc/components/Doc.tsx";
import { Route } from "litdoc/utils/route.ts";

export default function Content(props: {
  route: Route;
}) {
  const { route } = props;
  return (
    <Doc
      route={route}
      litdoc={litdoc}
    />
  );
}
