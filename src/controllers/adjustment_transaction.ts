import hapi from '@hapi/hapi';
import { createAdjustmentTransactionForm, updateAdjustmentTransactionForm } from '../models/adjustment_transaction';
import adjustmentTransactionUsecase from '../usecases/adjustment_transaction';
import {responseBuilder, action} from '../models/model'

export const getAll = async (request: hapi.Request, response: hapi.ResponseToolkit) => {
  try {
    const page: number = +request.query.page || 1;
    const per_page: number = +request.query.per_page || 10;
    const adjustmentTransactions = await adjustmentTransactionUsecase.getAll(page, per_page);
    return response.response(responseBuilder(action.get, "adjustment transactions", adjustmentTransactions)).code(200);
  } catch (error: any) {
    request.log('error', error);
    return response.response({ message: 'An error occurred', details: error  }).code(500);
  }
};

export const getById = async (request: hapi.Request, response: hapi.ResponseToolkit) => {
  try {
    const id: number = request.params.id;
    const adjustmentTransaction = await adjustmentTransactionUsecase.getById(id);
    if (!adjustmentTransaction) {
      return response.response({ message: 'Adjustment transaction not found' }).code(404);
    }
    return response.response(responseBuilder(action.get, "adjustment transaction", adjustmentTransaction)).code(200);
  } catch (error: any) {
    request.log('error', error);
    return response.response({ message: 'An error occurred', details: error }).code(500);
  }
};

export const create = async (request: hapi.Request, response: hapi.ResponseToolkit) => {
  try {
    const body: createAdjustmentTransactionForm = request.payload as createAdjustmentTransactionForm;
    const createdAdjustmentTransaction = await adjustmentTransactionUsecase.create(body);
    return response.response(responseBuilder(action.create, "adjustment transactions", createdAdjustmentTransaction)).code(201);
  } catch (error: any) {
    request.log('error', error);
    return response.response({ message: 'An error occurred' }).code(500);
  }
};

export const update = async (request: hapi.Request, response: hapi.ResponseToolkit) => {
  try {
    const id: bigint = BigInt(request.params.id);
    const body: updateAdjustmentTransactionForm = request.payload as updateAdjustmentTransactionForm;
    await adjustmentTransactionUsecase.update(id, body);
    return response.response(responseBuilder(action.update, "adjustment transactions")).code(200);
  } catch (error: any) {
    request.log('error', error);
    return response.response({ message: 'An error occurred' }).code(500);
  }
};

export const deleteByID = async (request: hapi.Request, response: hapi.ResponseToolkit) => {
  try {
    const id: bigint = BigInt(request.params.id);
    await adjustmentTransactionUsecase.deleteById(id);
    return response.response(responseBuilder(action.get, "adjustment transactions")).code(200);
  } catch (error: any) {
    request.log('error', error);
    return response.response({ message: 'An error occurred' }).code(500);
  }
};
