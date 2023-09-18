import { Root } from "litdoc/utils/schema.ts";
import { ComponentChildren, createContext } from "preact";
import { useContext } from "preact/hooks";

type Context = {
  modules: Record<string, unknown>;
  library?: Record<string, Root>;
};

const LitdocContext = createContext<Context>({
  modules: {},
  library: {},
});

export function useLitdoc() {
  return useContext(LitdocContext);
}

export function Litdoc(props: {
  modules: Record<string, unknown>;
  library?: Record<string, Root>;
  children: ComponentChildren;
}) {
  const { modules, library, children } = props;

  return (
    <LitdocContext.Provider value={{ modules, library }}>
      {children}
    </LitdocContext.Provider>
  );
}
