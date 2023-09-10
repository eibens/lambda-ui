export function FaIcon(props: {
  name: string;
  scale?: number;
}) {
  const { name, scale = 1 } = props;
  return (
    <i
      class={`fa-solid fa-${name}`}
      style={{
        display: "inline-flex",

        // Icons naturally have varying width causing them to be misaligned.
        width: "1.2em",
        justifyContent: "center",
        alignItems: "center",

        // Scale the icon to the desired size.
        transform: `scale(${scale})`,
        transformOrigin: "left center",
      }}
    />
  );
}
