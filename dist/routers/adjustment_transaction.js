"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adjustmentTransaction_1 = __importDefault(require("../controllers/adjustmentTransaction"));
const product = [
    {
        method: 'GET',
        path: '/adjustment-transaction',
        handler: adjustmentTransaction_1.default.getAll
    }, {
        method: 'GET',
        path: '/adjustment-transaction',
        handler: adjustmentTransaction_1.default.getBySku
    }, {
        method: 'POST',
        path: '/adjustment-transaction',
        handler: adjustmentTransaction_1.default.create
    }, {
        method: 'PUT',
        path: '/adjustment-transaction',
        handler: adjustmentTransaction_1.default.update
    }, {
        method: 'DELETE',
        path: '/adjustment-transaction',
        handler: adjustmentTransaction_1.default.delete
    }
];
exports.default = product;
