"use strict";
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
exports.fetchAllProducts = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function fetchProducts(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://codetesting.jubelio.store/wp-json/wc/v3/products?per_page=50&page=${page}&orderby=date`;
        const username = process.env.WOO_CLIENT_KEY;
        const password = process.env.WOO_CLIENT_SECRET;
        const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
        try {
            const response = yield axios_1.default.get(url, {
                headers: {
                    Authorization: authHeader,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error(`Error fetching products from page ${page}:`, error);
            return [];
        }
    });
}
function fetchAllProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        let page = 1;
        const allProducts = [];
        // Fetch 2 at one iteration (2 workers concurrently)
        while (true) {
            const requests = [fetchProducts(page), fetchProducts(page + 1)];
            const results = yield Promise.allSettled(requests);
            for (const result of results) {
                if (result.status === 'fulfilled') {
                    const products = result.value;
                    if (products.length === 0) {
                        return allProducts; // Exit the loop when there are no more products
                    }
                    allProducts.push(...products);
                }
            }
            page += 2; // Increment the page by 2 for the next set of requests
        }
    });
}
exports.fetchAllProducts = fetchAllProducts;
