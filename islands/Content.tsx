import * as docs from "../docs.ts";
import { ThematicBreak } from "../src/components/ThematicBreak.tsx";
import * as Editor from "../src/editor.ts";
import * as Kernel from "../src/kernel.ts";
import { PagePanel, Theme, View } from "../src/theme.ts";
import { Bundle } from "../src/types.ts";

/** MAIN **/

const kernel = Kernel.create(docs.doc());

export default function Content(props: {
  path: string;
  bundle: Bundle;
}) {
  const { path, bundle } = props;

  const route = Kernel.route(kernel, path);

  if (!route) {
    return <div>Not Found</div>;
  }

  const root = bundle.roots[route.key];
  if (!root) throw new Error(`No such root: ${route.key}`);

  const page = bundle.pages[route.key];
  if (!page) throw new Error(`No such page: ${route.key}`);

  const editor = Editor.create(root, route.values);

  return (
    <View
      class="flex justify-center"
      id="top"
    >
      <View class="my-32 px-6 w-full max-w-3xl gap-16 flex flex-col">
        <Theme editor={editor} />
        <ThematicBreak />
        <PagePanel
          page={page}
          kernel={kernel}
          bundle={bundle}
        />
      </View>
    </View>
  );
}
