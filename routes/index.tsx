import { PageProps } from "$fresh/server.ts";
import renderPath from "./[...path].tsx";

export default function render(props: PageProps) {
  return renderPath({
    ...props,
    params: { path: "" },
  });
}
