import { ComponentChildren, createContext } from "preact";
import { useContext } from "preact/hooks";
import type { Client } from "./client.ts";

/** HELPERS **/

const Context = createContext<{
  client?: Client;
}>({});

/** MAIN **/

export function LitdocClient(props: {
  client: Client;
  children: ComponentChildren;
}) {
  return (
    <Context.Provider value={{ client: props.client }}>
      {props.children}
    </Context.Provider>
  );
}

export function useLitdoc(): Client {
  const { client } = useContext(Context);
  if (!client) {
    throw new Error("No litdoc client found in context");
  }
  return client;
}
