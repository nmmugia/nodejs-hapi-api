"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../controllers/auth"));
const auth = [
    {
        method: 'POST',
        path: '/login',
        handler: auth_1.default
    },
];
exports.default = auth;
