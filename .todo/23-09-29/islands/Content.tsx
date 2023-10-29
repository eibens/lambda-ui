import { doc } from "../docs.ts";
import * as Client from "../src/client.ts";
import { Theme, View } from "../src/theme.ts";

/** MAIN **/

const client = Client.create(doc());

export default function Content(props: {
  path: string;
  bundle: Client.Bundle;
}) {
  const { path, bundle } = props;

  client.hydrate(bundle);
  const key = client.getKey(path);

  if (!key) {
    return <div>404 Not Found</div>;
  }

  const editor = client.getEditor(key);

  return (
    <View
      class="flex justify-center"
      id="top"
    >
      <View class="my-32 px-6 w-full max-w-3xl gap-16 flex flex-col">
        <Theme editor={editor} />
      </View>
    </View>
  );
}
