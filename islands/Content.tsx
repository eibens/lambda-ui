import * as docs from "../docs.ts";
import * as Editor from "../src/editor.ts";
import * as Kernel from "../src/kernel.ts";
import { Theme } from "../src/theme.ts";
import { Bundle } from "../src/types.ts";

/** MAIN **/

const kernel = Kernel.create(docs.doc());

export default function Content(props: {
  path: string;
  bundle: Bundle;
}) {
  const { path, bundle } = props;

  const key = Kernel.route(kernel, path);
  const root = bundle.roots[key];
  if (!root) throw new Error(`No such root: ${key}`);

  const page = bundle.pages[key];
  if (!page) throw new Error(`No such page: ${key}`);

  const values = Kernel.getValues(kernel, key);
  const editor = Editor.create(root, { ...values });

  return (
    <Theme
      editor={editor}
    />
  );
}
