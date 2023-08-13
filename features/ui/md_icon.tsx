export function MdIcon(props: {
  children: string;
}) {
  const { children } = props;
  return (
    <span
      class="material-symbols-outlined align-middle"
      style={{
        fontSize: "inherit",
      }}
    >
      {children}
    </span>
  );
}
