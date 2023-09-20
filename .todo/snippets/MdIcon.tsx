export function MdIcon(props: {
  children: string;
}) {
  const { children } = props;

  // This little guy helps with alignment (no idea why).
  const spacer = (
    <span
      style={{
        opacity: 0,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      x
    </span>
  );

  // real hacky stuff to align material icon vertically
  return (
    <span
      style={{
        display: "inline-flex",
        position: "relative",
      }}
    >
      <span
        style={{
          position: "relative",
          width: "1em",
          height: "0",
        }}
      >
        {spacer}
        <span
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            fontFamily: "Material Symbols Outlined",
            WebkitFontFeatureSettings: "'liga'",
            fontWeight: "normal",
          }}
        >
          {children}
        </span>
      </span>
    </span>
  );
}
