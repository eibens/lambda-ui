export function MdIcon(props: {
  children: string;
}) {
  const { children } = props;
  return (
    <span
      class="material-symbols-outlined"
      style={{
        fontSize: "inherit",
        verticalAlign: "middle",
      }}
    >
      {children}
    </span>
  );
}
