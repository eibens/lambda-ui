import { MonacoProvider } from "@litdoc/monaco";
import * as Theme from "@litdoc/theme";
import { Doc } from "litdoc";
import manifest from "../litdoc.gen.ts";

export default function Content(props: {
  path: string;
}) {
  const { path } = props;
  return (
    <MonacoProvider>
      <Doc
        path={path}
        manifest={manifest}
        components={Theme}
      />
    </MonacoProvider>
  );
}
