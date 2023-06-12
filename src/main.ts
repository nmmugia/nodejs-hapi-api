import Hapi, { Server } from "@hapi/hapi";
import auth from "./routers/auth";
import adjustment_transaction from "./routers/adjustment_transaction";
import product from "./routers/product";
import dotenv from "dotenv";

dotenv.config();

const server = Hapi.server({
  port: process.env.PORT || 4000,
  host: '0.0.0.0',
});

server.route(auth);
server.route(adjustment_transaction);
server.route(product);

export async function startServer(): Promise<Server> {
  await server.start();
  console.log(`Server running on ${server.info.uri}`);
  return server;
}

export async function stopServer(): Promise<void> {
  await server.stop();
}

startServer();