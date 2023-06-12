import { adjustmentTransaction, createAdjustmentTransactionForm, updateAdjustmentTransactionForm } from '../models/adjustment_transaction';
import adjustmentTransactionRepositorySQL from '../repositories/sql/adjustment_transaction';
import Boom from '@hapi/boom';

// Get all adjustment transactions
const getAll = async (page: number, per_page: number): Promise<adjustmentTransaction[]> => {
  try {
    return await adjustmentTransactionRepositorySQL.getAllAdjustmentTransaction(page, per_page);
  } catch (error: any) {
    throw Boom.internal(error);
  }
}

// Get adjustment transaction by Id
const getById = async (Id: number): Promise<adjustmentTransaction | null> => {
  try {
    return await adjustmentTransactionRepositorySQL.getAdjustmentTransactionById(Id);
  } catch (error: any) {
    throw Boom.internal(error);
  }
}

// Create an adjustment transaction
const create = async (data: createAdjustmentTransactionForm): Promise<adjustmentTransaction> => {
  try {
    return await adjustmentTransactionRepositorySQL.createAdjustmentTransaction(data);
  } catch (error: any) {
    throw Boom.internal(error);
  }
}

// Update an adjustment transaction
const update = async (id: bigint, data: updateAdjustmentTransactionForm): Promise<void> => {
  try {
    await adjustmentTransactionRepositorySQL.updateAdjustmentTransaction(id, data);
  } catch (error: any) {
    throw Boom.internal(error);
  }
}

// Delete an adjustment transaction by ID
const deleteById = async (id: bigint): Promise<void> => {
  try {
    await adjustmentTransactionRepositorySQL.deleteAdjustmentTransactionById(id);
  } catch (error: any) {
    throw Boom.internal(error);
  }
}

export default {
  getAll,
  getById,
  create,
  update,
  deleteById
}