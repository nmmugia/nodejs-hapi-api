'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = exports.init = void 0;
const hapi_1 = __importDefault(require("@hapi/hapi"));
const auth_1 = __importDefault(require("./routers/auth"));
const server = hapi_1.default.server({
    port: process.env.PORT || 4000,
    host: '0.0.0.0'
});
const init = function () {
    return __awaiter(this, void 0, void 0, function* () {
        server.route(auth_1.default);
        return server;
    });
};
exports.init = init;
const start = function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Listening on ${server.settings.host}:${server.settings.port}`);
        return server.start();
    });
};
exports.start = start;
process.on('unhandledRejection', (err) => {
    console.error("unhandledRejection");
    console.error(err);
    process.exit(1);
});
(0, exports.init)().then(() => (0, exports.start)());
