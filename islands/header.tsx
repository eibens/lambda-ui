import { View } from "@/features/theme/mod.ts";
import {
  Header as HeaderBase,
  HeaderProps,
} from "@/features/widgets/header.tsx";

/** MAIN **/

export default function Header(props: HeaderProps) {
  const { size, breadcrumbs = [] } = props;
  return (
    <HeaderBase
      size={size}
      breadcrumbs={[{
        href: "/",
        icon: (
          <View class="flex items-center justify-center mt-[2px]">
            Λ
          </View>
        ),
      }, ...breadcrumbs]}
    />
  );
}
