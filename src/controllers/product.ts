import hapi from '@hapi/hapi';
import {createProductForm, updateProductForm} from '../models/product'
import {responseBuilder, action} from '../models/model'
import productUsecase from '../usecases/product'
import Boom from "@hapi/boom";

export const getAll = async (request: hapi.Request, response: hapi.ResponseToolkit) => {
    try {
        
    const page: number = +request.query.page || 1;
    const per_page: number = +request.query.per_page || 10;
    const products = await productUsecase.getAll(page, per_page);
    return response.response(responseBuilder(action.get, "products", products)).code(200);
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
        return response.response(responseBuilder(action.get, "product", product)).code(200);
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
        const body: createProductForm = request.payload as createProductForm;
        const id = await productUsecase.create(body);
        return response.response(responseBuilder(action.create, "product", {id})).code(201)
    } catch (error: any) {
        request.log("error", error);
        return Boom.badImplementation(JSON.stringify(error))
    }
};
export const update = async (request: hapi.Request, response: hapi.ResponseToolkit) => {
    try {
        const id: bigint = BigInt(request.params.id);
        const body: updateProductForm = request.payload as updateProductForm;
        await productUsecase.update(id, body);
        return response.response(responseBuilder(action.update, "product")).code(200)
    } catch (error: any) {
        request.log("error", error);
        return Boom.badImplementation(JSON.stringify(error))
    }
};
export const deleteById = async (request: hapi.Request, response: hapi.ResponseToolkit) => {
    try {
        const id: bigint = BigInt(request.params.id);
        await productUsecase.deleteById(id);
        return response.response(responseBuilder(action.delete, "product")).code(200)
    } catch (error: any) {
        request.log("error", error);
        return Boom.badImplementation(JSON.stringify(error))
    }
};
export const sync = async (request: hapi.Request, response: hapi.ResponseToolkit) => {
    try {
        await productUsecase.sync();
        return response.response(responseBuilder(action.other, "sync product data to db")).code(200)
    } catch (error: any) {
        request.log("error", error);
        return Boom.badImplementation(JSON.stringify(error))
    }
};
