export function Span(props: {
  children: string;
}) {
  const { children } = props;
  return <span class="align-middle">{children}</span>;
}
