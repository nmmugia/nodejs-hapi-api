"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = __importDefault(require("../controllers/product"));
const product = [
    {
        method: 'GET',
        path: '/products',
        handler: product_1.default.getAll
    }, {
        method: 'GET',
        path: '/product/{id}',
        handler: product_1.default.getById
    }, {
        method: 'POST',
        path: '/products',
        handler: product_1.default.create
    }, {
        method: 'PUT',
        path: '/products',
        handler: product_1.default.update
    }, {
        method: 'DELETE',
        path: '/products',
        handler: product_1.default.delete
    }, {
        method: 'POST',
        path: '/products/sync',
        handler: product_1.default.sync
    }
];
exports.default = product;
