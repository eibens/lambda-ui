import editor from "@/features/monaco/mod_doc.tsx";
import { Content } from "../components/content.tsx";
import { MonacoProvider } from "../features/monaco/mod.ts";

/** MAIN **/

export default function Monaco() {
  editor.children = [{
    type: "root",
    children: editor.children,
  }];
  return (
    <MonacoProvider>
      <Content
        editor={editor}
      />
    </MonacoProvider>
  );
}
