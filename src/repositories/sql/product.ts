import { Pool, QueryResult } from 'pg';
import { product, createProduct, updateProduct } from '../../models/product';
import {pool} from './connection'

// Get all products
export async function getAllProducts(): Promise<product[]> {
  try {
    const query = 'SELECT * FROM product';
    const result = await pool.query(query);
    return result.rows as product[];
  } catch (error) {
    throw error;
  }
}

// Get product by ID
export async function getProductById(id: bigint): Promise<product | null> {
  try {
    const query = 'SELECT * FROM product WHERE id = $1';
    const result = await pool.query(query, [id]);
    const product = result.rows[0] as product;
    return product || null;
  } catch (error) {
    throw error;
  }
}

// Create a product
export async function createProduct(productData: createProduct): Promise<bigint> {
  try {
    const query = `
      INSERT INTO product (sku, name, price, image, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    const values = [productData.sku, productData.name, productData.price, productData.image, productData.description];
    const result = await pool.query(query, values);
    const id = result.rows[0].id as bigint;
    return id;
  } catch (error) {
    throw error;
  }
}

// Update a product
export async function updateProductById(
  id: bigint,
  data: updateProduct
): Promise<void> {
  const client = await pool.connect();
  try {
    const updateFields: string[] = [];
    const values: any[] = [];

    if (data.sku !== undefined) {
      updateFields.push('sku');
      values.push(data.sku);
    }

    if (data.name !== undefined) {
      updateFields.push('name');
      values.push(data.name);
    }

    if (data.price !== undefined) {
      updateFields.push('price');
      values.push(data.price);
    }

    if (data.description !== undefined) {
      updateFields.push('description');
      values.push(data.description);
    }

    if (updateFields.length === 0) {
      throw new Error(`No fields provided to update.`);
    }

    const setFields = updateFields.map((field, index) => `${field} = $${index + 1}`).join(', ');

    const query = {
      text: `UPDATE product
             SET ${setFields}, updated_at = $${new Date()}
             WHERE id = $${id}`,
      values: values
    };

    const result = await client.query(query);

    if (result.rowCount === 0) {
      throw new Error(`Adjustment transaction with ID ${id} not found.`);
    }
  } finally {
    client.release();
  }
}


// Delete a product by ID
export async function deleteProductById(id: bigint): Promise<void> {
  try {
    const query = 'DELETE FROM product WHERE id = $1';
    await pool.query(query, [id]);
  } catch (error) {
    throw error;
  }
}

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById
}