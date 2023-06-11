'use strict';
import 'source-map-support/register';
import Hapi from "@hapi/hapi";
import { Server } from "@hapi/hapi";
import auth from "./routers/auth";
import adjustment_transaction from "./routers/adjustment_transaction";
import product from "./routers/product";
import dotenv from "dotenv"

dotenv.config()
const server = Hapi.server({
    port: process.env.PORT || 4000,
    host: '0.0.0.0'
});

export const init = async function(): Promise<Server> {
    server.route(auth);
    server.route(adjustment_transaction);
    server.route(product);
    return server;
};

export const start = async function (): Promise<void> {
    console.log(`Listening on ${server.settings.host}:${server.settings.port}`);
    return server.start();
};

process.on('unhandledRejection', (err) => {
    console.error("unhandledRejection");
    console.error(err);
    process.exit(1);
});

init().then(() => start());