import * as Server from "./src/server.ts";

const server = Server.create();
await server.start();
