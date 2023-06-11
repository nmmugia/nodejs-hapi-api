import { adjustmentTransaction, createAdjustmentTransaction, updateAdjustmentTransaction } from '../models/adjustment_transaction';
import adjustmentTransactionRepositorySQL from '../repositories/sql/adjustment_transaction';

// Get all adjustment transactions
const getAll = async (page: number, per_page: number): Promise<adjustmentTransaction[]> => {
  try {
    return await adjustmentTransactionRepositorySQL.getAllAdjustmentTransaction(page, per_page);
  } catch (error) {
    throw error;
  }
}

// Get adjustment transaction by SKU
const getBySku = async (sku: string): Promise<adjustmentTransaction | null> => {
  try {
    return await adjustmentTransactionRepositorySQL.getAdjustmentTransactionBySku(sku);
  } catch (error) {
    throw error;
  }
}

// Create an adjustment transaction
const create = async (data: createAdjustmentTransaction): Promise<adjustmentTransaction> => {
  try {
    return await adjustmentTransactionRepositorySQL.createAdjustmentTransaction(data);
  } catch (error) {
    throw error;
  }
}

// Update an adjustment transaction
const update = async (id: bigint, data: updateAdjustmentTransaction): Promise<void> => {
  try {
    await adjustmentTransactionRepositorySQL.updateAdjustmentTransaction(id, data);
  } catch (error) {
    throw error;
  }
}

// Delete an adjustment transaction by ID
const deleteById = async (id: bigint): Promise<void> => {
  try {
    await adjustmentTransactionRepositorySQL.deleteAdjustmentTransactionById(id);
  } catch (error) {
    throw error;
  }
}

export default {
  getAll,
  getBySku,
  create,
  update,
  deleteById
}