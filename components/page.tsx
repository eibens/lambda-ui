import { View, ViewChildren } from "@/features/theme/mod.ts";
import { Breadcrumbs } from "@/features/widgets/header.tsx";
import Header from "@/islands/header.tsx";

/** MAIN **/

export function Page(props: {
  breadcrumbs?: Breadcrumbs;
  children?: ViewChildren;
}) {
  const { breadcrumbs, children } = props;

  return (
    <View class="flex justify-center">
      <Header
        size="md"
        breadcrumbs={breadcrumbs}
      />
      {children}
    </View>
  );
}
