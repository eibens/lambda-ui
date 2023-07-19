import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/src/runtime/head.ts";
import { View } from "@/features/theme/mod.ts";
import Home from "@/islands/home.tsx";
import HomeHeader from "@/islands/home_header.tsx";
import manifest from "../litdoc.gen.ts";

/** MAIN **/

export type Data = {
  features: {
    name: string;
    path: string;
  }[];
};

export type Props = PageProps<Data>;

export const handler: Handlers = {
  GET: (_, ctx) => {
    const data: Data = {
      features: Object.keys(manifest.routes)
        .map((path) => ({
          name: path
            .substring("./features/".length, path.lastIndexOf("/")),
          path: path
            .substring(1)
            .substring(0, path.lastIndexOf("/")),
        })),
    };

    return ctx.render(data);
  },
};

export default function render(props: Props) {
  return (
    <>
      <Head>
        <title>Lambda UI</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap"
        />
      </Head>
      <View class="flex justify-center" id="top">
        <HomeHeader />
        <View class="my-32 px-6 w-full max-w-3xl">
          <Home features={props.data.features} />
        </View>
      </View>
    </>
  );
}
