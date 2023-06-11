import hapi from '@hapi/hapi';
import { adjustmentTransaction, createAdjustmentTransaction, updateAdjustmentTransaction } from '../models/adjustment_transaction';
import adjustmentTransactionUsecase from '../usecases/adjustment_transaction';

export const getAll = async (request: hapi.Request, response: hapi.ResponseToolkit) => {
  try {
    const page: number = request.query.page <= '0' ? 1 : +request.query.page;
    const per_page: number = request.query.page <= '0' ? 10 : +request.query.page;
    const adjustmentTransactions = await adjustmentTransactionUsecase.getAll(page, per_page);
    return response.response(adjustmentTransactions).code(200);
  } catch (error: any) {
    request.log('error', error);
    return response.response({ message: 'An error occurred' }).code(500);
  }
};

export const getBySku = async (request: hapi.Request, response: hapi.ResponseToolkit) => {
  try {
    const sku: string = request.params.sku;
    const adjustmentTransaction = await adjustmentTransactionUsecase.getBySku(sku);
    if (!adjustmentTransaction) {
      return response.response({ message: 'Adjustment transaction not found' }).code(404);
    }
    return response.response(adjustmentTransaction).code(200);
  } catch (error: any) {
    request.log('error', error);
    return response.response({ message: 'An error occurred' }).code(500);
  }
};

export const create = async (request: hapi.Request, response: hapi.ResponseToolkit) => {
  try {
    const body: createAdjustmentTransaction = request.payload as createAdjustmentTransaction;
    const createdAdjustmentTransaction = await adjustmentTransactionUsecase.create(body);
    return response.response(createdAdjustmentTransaction).code(201);
  } catch (error: any) {
    request.log('error', error);
    return response.response({ message: 'An error occurred' }).code(500);
  }
};

export const update = async (request: hapi.Request, response: hapi.ResponseToolkit) => {
  try {
    const id: bigint = BigInt(request.params.id);
    const body: updateAdjustmentTransaction = request.payload as updateAdjustmentTransaction;
    await adjustmentTransactionUsecase.update(id, body);
    return response.response({ message: 'Adjustment transaction updated successfully' }).code(200);
  } catch (error: any) {
    request.log('error', error);
    return response.response({ message: 'An error occurred' }).code(500);
  }
};

export const deleteByID = async (request: hapi.Request, response: hapi.ResponseToolkit) => {
  try {
    const id: bigint = BigInt(request.params.id);
    await adjustmentTransactionUsecase.deleteById(id);
    return response.response({ message: 'Adjustment transaction deleted successfully' }).code(200);
  } catch (error: any) {
    request.log('error', error);
    return response.response({ message: 'An error occurred' }).code(500);
  }
};
