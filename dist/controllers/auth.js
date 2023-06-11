"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const login = (request, response) => {
    const payload = request.payload;
    return jsonwebtoken_1.default.sign({ username: payload.username }, process.env.JWT_SECRET || "secret", { algorithm: "HS256", keyid: "key" });
};
exports.default = login;
