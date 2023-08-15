export function FaIcon(props: {
  name: string;
}) {
  const { name } = props;
  return (
    <i
      class={`fa-solid fa-${name}`}
      style={{
        display: "inline-flex",

        // Icons naturally have varying width causing them to be misaligned.
        width: "1em",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
}
