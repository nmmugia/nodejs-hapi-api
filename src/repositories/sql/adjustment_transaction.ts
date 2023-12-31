import { adjustmentTransaction, createAdjustmentTransactionForm, updateAdjustmentTransactionForm } from '../../models/adjustment_transaction';
import {pool} from './connection';
import Boom from '@hapi/boom';

// Get all adjustment transaction
export async function getAllAdjustmentTransaction(page: number, per_page: number): Promise<adjustmentTransaction[]> {
    try {
      const query = `SELECT * FROM adjustment_transaction WHERE deleted_at ISNULL LIMIT ${per_page} OFFSET ${(page-1)*per_page}`;
      const result = await pool.query(query);
      return result.rows as adjustmentTransaction[];
    } catch (error: any) {
      throw Boom.internal(error);
    }
  }
  
  // Get adjustment transaction by ID
  export async function getAdjustmentTransactionById(id: number): Promise<adjustmentTransaction | null> {
    try {
      const query = 'SELECT * FROM adjustment_transaction WHERE id = $1 AND deleted_at ISNULL';
      const results = await pool.query(query, [id]);
      const result = results.rows[0] as adjustmentTransaction;
      return result || null;
    } catch (error: any) {
      throw Boom.internal(error);
    }
  }
  

export async function createAdjustmentTransaction(data: createAdjustmentTransactionForm): Promise<adjustmentTransaction> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const product = await client.query(
      `SELECT sku, price
      FROM product
      WHERE
      sku = $1`,
      [data.sku]
    );
    if (product.rowCount <= 0) {
      throw Boom.notFound("product is not found")
    }
    const price = product.rows[0].price
    // Create adjustment transaction
    const { rows: [adjustmentTransactionId] } = await client.query<adjustmentTransaction>(
      `INSERT INTO adjustment_transaction (sku, qty, amount, description)
       VALUES ($1, $2, $3, $4)
       RETURNING id, sku, qty, amount, description`,
      [data.sku, data.qty, price*data.qty, data.description]
    );

    // Get product stock based on SKU
    const { rows: productStock } = await client.query(
      `SELECT id, last_qty
       FROM product_stock
       WHERE product_id = (SELECT id FROM product WHERE sku = $1)
       ORDER BY id DESC
       LIMIT 1
       FOR UPDATE`,
      [data.sku]
    );

    // Calculate new stock quantity
    const previousProductStock = productStock.length > 0 ? productStock[0].id : null;
    const previousQty = productStock.length > 0 ? +productStock[0].last_qty : 0;
    const lastQty = previousQty + data.qty;
    const qtyChanges = data.qty;
    if (lastQty < 0) {
      throw Boom.badRequest("quantity after the transaction is less than 0, please recheck the qty");
    }
    // Create product stock entry
    await client.query(
      `INSERT INTO product_stock (product_id, transaction_id, description, previous_product_stock, previous_qty, last_qty, qty_changes)
       VALUES ((SELECT id FROM product WHERE sku = $1), $2, $3, $4, $5, $6, $7)`,
      [data.sku, adjustmentTransactionId.id, data.description, previousProductStock, previousQty, lastQty, qtyChanges]
    );

    await client.query('COMMIT');

    return adjustmentTransactionId;
  } catch (error: any) {
    await client.query('ROLLBACK');
    throw Boom.internal(error);
  } finally {
    client.release();
  }
}

export async function updateAdjustmentTransaction(id: bigint, data: updateAdjustmentTransactionForm): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const product = await client.query(
      `SELECT sku, price
      FROM product
      WHERE
      sku = $1`,
      [data.sku]
    );
    if (product.rowCount <= 0) {
      throw Boom.notFound("product is not found")
    }
    const price = product.rows[0].price
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
      [updatedAdjustmentTransaction.sku, updatedAdjustmentTransaction.qty, updatedAdjustmentTransaction.qty*price, updatedAdjustmentTransaction.description, id]
    );

    // Get product stock based on SKU
    const { rows: productStock } = await client.query(
      `SELECT id, last_qty as qty
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
    const qtyChanges = data.qty !== undefined && existingAdjustmentTransaction.qty !== undefined ?
    data.qty - existingAdjustmentTransaction.qty: 0;
    const lastQty = previousQty + qtyChanges;
    if (lastQty < 0) {
      throw Boom.badRequest("quantity after the transaction is less than 0, please recheck the qty");
    }

    const desc = `Update transaction operation(correction),
    details:${data.description}`;

    // Create product stock entry
    await client.query(
      `INSERT INTO product_stock (product_id, transaction_id, description, previous_product_stock, previous_qty, last_qty, qty_changes)
       VALUES ((SELECT id FROM product WHERE sku = $1), $2, $3, $4, $5, $6, $7)`,
      [data.sku, id, desc, previousProductStock, previousQty, lastQty, qtyChanges]
    );

    await client.query('COMMIT');
  } catch (error: any) {
    console.log(error);
    await client.query('ROLLBACK');
    throw Boom.internal(error);
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
       WHERE id = $1`,
      [id]
    );

    // Delete the adjustment transaction
    await client.query('UPDATE adjustment_transaction set deleted_by=CURRENT_USER, deleted_at=NOW() WHERE id = $1 ', [id]);

    // Get product stock based on SKU
    const { rows: productStock } = await client.query(
      `SELECT id, last_qty as qty
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
    if (lastQty < 0) {
      throw Boom.badRequest("quantity after the transaction is less than 0, please recheck the qty");
    }
    // Create product stock entry
    await client.query(
      `INSERT INTO product_stock (product_id, transaction_id, description, previous_product_stock, previous_qty, last_qty, qty_changes)
       VALUES ((SELECT id FROM product WHERE sku = $1), $2, $3, $4, $5, $6, $7)`,
      [adjustmentTransaction.sku, id, adjustmentTransaction.description, previousProductStock, previousQty, lastQty, qtyChanges]
    );

    await client.query('COMMIT');
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.log(error);
    throw Boom.internal(error);
  } finally {
    client.release();
  }
}

export default {getAllAdjustmentTransaction, getAdjustmentTransactionById, createAdjustmentTransaction, updateAdjustmentTransaction, deleteAdjustmentTransactionById}