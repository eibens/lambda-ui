import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/src/runtime/head.ts";
import { View } from "@/features/theme/mod.ts";
import Home, { HomeProps } from "@/islands/home.tsx";
import HomeHeader from "@/islands/home_header.tsx";
import manifest from "../litdoc.gen.ts";

/** MAIN **/

export type Props = PageProps<HomeProps>;

export const handler: Handlers = {
  GET: (_, ctx) => {
    const data: HomeProps = {
      features: Object.keys(manifest.routes),
    };

    return ctx.render(data);
  },
};

export default function render(props: Props) {
  const { data } = props;
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
          <Home {...data} />
        </View>
      </View>
    </>
  );
}
