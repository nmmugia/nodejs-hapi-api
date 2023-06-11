import { Pool, QueryConfig } from 'pg';
import { adjustmentTransaction, createAdjustmentTransaction, updateAdjustmentTransaction } from '../models/adjustment_transaction';

const pool = new Pool();


// Get all adjustment transaction
export async function getAllAdjustmentTransaction(): Promise<adjustmentTransaction[]> {
    try {
      const query = 'SELECT * FROM adjustment_transaction';
      const result = await pool.query(query);
      return result.rows as adjustmentTransaction[];
    } catch (error) {
      throw error;
    }
  }
  
  // Get adjustment transaction by ID
  export async function getAdjustmentTransactionBySku(sku: string): Promise<adjustmentTransaction | null> {
    try {
      const query = 'SELECT * FROM adjustment_transaction WHERE id = $1';
      const results = await pool.query(query, [sku]);
      const result = results.rows[0] as adjustmentTransaction;
      return result || null;
    } catch (error) {
      throw error;
    }
  }
  

export async function createAdjustmentTransaction(data: createAdjustmentTransaction): Promise<adjustmentTransaction> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create adjustment transaction
    const { rows: [adjustmentTransactionId] } = await client.query<adjustmentTransaction>(
      `INSERT INTO adjustment_transaction (sku, qty, amount, description)
       VALUES ($1, $2, $3, $4)
       RETURNING id, sku, qty, amount, description`,
      [data.sku, data.qty, data.amount, data.description]
    );

    // Get product stock based on SKU
    const { rows: productStock } = await client.query(
      `SELECT id, qty
       FROM product_stock
       WHERE product_id = (SELECT id FROM product WHERE sku = $1)
       ORDER BY id DESC
       LIMIT 1
       FOR UPDATE`,
      [data.sku]
    );

    // Calculate new stock quantity
    const previousProductStock = productStock.length > 0 ? productStock[0].id : null;
    const previousQty = productStock.length > 0 ? productStock[0].qty : 0;
    const lastQty = previousQty + data.qty;
    const qtyChanges = data.qty;

    // Create product stock entry
    await client.query(
      `INSERT INTO product_stock (product_id, transaction_id, description, previous_product_stock, previous_qty, last_qty, qty_changes)
       VALUES ((SELECT id FROM product WHERE sku = $1), $2, $3, $4, $5, $6, $7)`,
      [data.sku, adjustmentTransactionId.id, data.description, previousProductStock, previousQty, lastQty, qtyChanges]
    );

    await client.query('COMMIT');

    return adjustmentTransactionId;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function updateAdjustmentTransaction(id: bigint, data: updateAdjustmentTransaction): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Get the existing adjustment transaction
    const { rows: [existingAdjustmentTransaction] } = await client.query<adjustmentTransaction>(
      `SELECT sku, qty, description
       FROM adjustment_transaction
       WHERE id = $1
       FOR UPDATE`,
      [id]
    );

    // Update the adjustment transaction
    const updatedAdjustmentTransaction = { ...existingAdjustmentTransaction, ...data };
    await client.query(
      `UPDATE adjustment_transaction
       SET sku = $1, qty = $2, amount = $3, description = $4
       WHERE id = $5`,
      [updatedAdjustmentTransaction.sku, updatedAdjustmentTransaction.qty, updatedAdjustmentTransaction.amount, updatedAdjustmentTransaction.description, id]
    );

    // Get product stock based on SKU
    const { rows: productStock } = await client.query(
      `SELECT id, qty
       FROM product_stock
       WHERE product_id = (SELECT id FROM product WHERE sku = $1)
       ORDER BY id DESC
       LIMIT 1
       FOR UPDATE`,
      [existingAdjustmentTransaction.sku]
    );

    // Calculate new stock quantity
    const previousProductStock = productStock.length > 0 ? productStock[0].id : null;
    const previousQty = productStock.length > 0 ? productStock[0].qty : 0;
    const lastQty = previousQty - existingAdjustmentTransaction.qty + updatedAdjustmentTransaction.qty;
    const qtyChanges = updatedAdjustmentTransaction.qty - existingAdjustmentTransaction.qty;

    // Create product stock entry
    await client.query(
      `INSERT INTO product_stock (product_id, transaction_id, description, previous_product_stock, previous_qty, last_qty, qty_changes)
       VALUES ((SELECT id FROM product WHERE sku = $1), $2, $3, $4, $5, $6, $7)`,
      [existingAdjustmentTransaction.sku, id, updatedAdjustmentTransaction.description, previousProductStock, previousQty, lastQty, qtyChanges]
    );

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteAdjustmentTransactionById(id: bigint): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Get the adjustment transaction
    const { rows: [adjustmentTransaction] } = await client.query<adjustmentTransaction>(
      `SELECT sku, qty, description
       FROM adjustment_transaction
       WHERE id = $1
       FOR UPDATE`,
      [id]
    );

    // Delete the adjustment transaction
    await client.query('DELETE FROM adjustment_transaction WHERE id = $1', [id]);

    // Get product stock based on SKU
    const { rows: productStock } = await client.query(
      `SELECT id, qty
       FROM product_stock
       WHERE product_id = (SELECT id FROM product WHERE sku = $1)
       ORDER BY id DESC
       LIMIT 1
       FOR UPDATE`,
      [adjustmentTransaction.sku]
    );

    // Calculate new stock quantity
    const previousProductStock = productStock.length > 0 ? productStock[0].id : null;
    const previousQty = productStock.length > 0 ? productStock[0].qty : 0;
    const lastQty = previousQty - adjustmentTransaction.qty;
    const qtyChanges = -adjustmentTransaction.qty;

    // Create product stock entry
    await client.query(
      `INSERT INTO product_stock (product_id, transaction_id, description, previous_product_stock, previous_qty, last_qty, qty_changes)
       VALUES ((SELECT id FROM product WHERE sku = $1), $2, $3, $4, $5, $6, $7)`,
      [adjustmentTransaction.sku, id, adjustmentTransaction.description, previousProductStock, previousQty, lastQty, qtyChanges]
    );

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export default {getAllAdjustmentTransaction, getAdjustmentTransactionBySku, createAdjustmentTransaction, updateAdjustmentTransaction, deleteAdjustmentTransactionById}