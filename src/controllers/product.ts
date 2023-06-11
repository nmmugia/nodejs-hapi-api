import hapi from '@hapi/hapi';
import {product, createProduct, updateProduct} from '../models/product'
import {responseBuilder, action} from '../models/model'
import productUsecase from '../usecases/product'
import Boom from "@hapi/boom";

export const getAll = async (request: hapi.Request, response: hapi.ResponseToolkit) => {
    try {
      const products = await productUsecase.getAll();
      return response.response(responseBuilder(action.other, "products", products)).code(200);
    } catch (error: any) {
      request.log("error", error);
      return Boom.badImplementation(JSON.stringify(error));
    }
};
  
export const getById = async (request: hapi.Request, response: hapi.ResponseToolkit) => {
try {
    const id: bigint = BigInt(request.params.id);
    const product = await productUsecase.getById(id);
    
    if (product) {
    return response.response(responseBuilder(action.other, "product", product)).code(200);
    } else {
    return Boom.notFound('Product not found');
    }
} catch (error: any) {
    request.log("error", error);
    return Boom.badImplementation(JSON.stringify(error));
}
};
export const create = async (request: hapi.Request, response: hapi.ResponseToolkit) => {
    try {
        const body: createProduct = request.payload as createProduct;
        const id = productUsecase.create(body);
        return response.response(responseBuilder(action.create, "product", {id})).code(201)
    } catch (error: any) {
        request.log("error", error);
        return Boom.badImplementation(JSON.stringify(error))
    }
};
export const update = async (request: hapi.Request, response: hapi.ResponseToolkit) => {
    try {
        const id: bigint = BigInt(request.params.id);
        const body: updateProduct = request.payload as updateProduct;
        productUsecase.update(id, body);
        return response.response(responseBuilder(action.update, "product")).code(200)
    } catch (error: any) {
        request.log("error", error);
        return Boom.badImplementation(JSON.stringify(error))
    }
};
export const deleteById = async (request: hapi.Request, response: hapi.ResponseToolkit) => {
    try {
        const id: bigint = BigInt(request.params.id);
        productUsecase.deleteById(id);
        return response.response(responseBuilder(action.update, "product")).code(200)
    } catch (error: any) {
        request.log("error", error);
        return Boom.badImplementation(JSON.stringify(error))
    }
};
export const sync = async (request: hapi.Request, response: hapi.ResponseToolkit) => {
    try {
        productUsecase.sync();
        return response.response(responseBuilder(action.other, "product")).code(200)
    } catch (error: any) {
        request.log("error", error);
        return Boom.badImplementation(JSON.stringify(error))
    }
};
