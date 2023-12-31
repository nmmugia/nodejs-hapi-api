import { Pool, QueryResult } from 'pg';
import { product, createProductForm, updateProductForm } from '../../models/product';
import {pool} from './connection';
import Boom from '@hapi/boom';

// Get all products
export async function getAllProducts(page: number, per_page: number): Promise<product[]> {
  try {
    const query = `
    SELECT
    p.*,
    COALESCE(ps.last_qty, 0) AS stock
    FROM
        product p
    LEFT JOIN (
        SELECT
            product_id,
            last_qty
        FROM
            product_stock
        ORDER BY
            created_at DESC
        LIMIT 1
    ) ps ON ps.product_id = p.id
    LIMIT ${per_page} OFFSET ${(page-1)*per_page}`;
    const result = await pool.query(query);
    return result.rows as product[];
  } catch (error: any) {
    throw Boom.internal(error);
  }
}

// Get product by ID
export async function getProductById(id: bigint): Promise<product | null> {
  try {
    const query = `SELECT
    p.*,
    COALESCE(ps.last_qty, 0) AS stock
    FROM
        product p
    LEFT JOIN (
        SELECT
            product_id,
            last_qty
        FROM
            product_stock
        ORDER BY
            created_at DESC
        LIMIT 1
    ) ps ON ps.product_id = p.id
    WHERE id = ${id}`;
    const result = await pool.query(query);
    const product = result.rows[0] as product;
    return product || null;
  } catch (error: any) {
    throw Boom.internal(error);
  }
}

// Create a product
export async function createProduct(productData: createProductForm): Promise<bigint> {
  try {
    const query = `
      INSERT INTO product (sku, name, price, image, description)
      VALUES ($1, $2, $3, $4::jsonb, $5)
      RETURNING id
    `;

    const values = [productData.sku, productData.name, productData.price, JSON.stringify([{src: productData.image}]), productData.description];

    const result = await pool.query(query, values);
    const id = result.rows[0].id as bigint;
    return id;

  } catch (error: any) {
    throw Boom.internal(error);
  }
}

// Update a product
export async function updateProductById(
  id: bigint,
  data: updateProductForm
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

    if (data.image !== undefined) {
      updateFields.push('image');
      values.push([{src: data.image}]);
    }

    if (data.description !== undefined) {
      updateFields.push('description');
      values.push(data.description);
    }

    if (updateFields.length === 0) {
      throw Boom.badRequest(`No fields provided to update.`);
    }

    const setFields = updateFields.map(
      (field, index) => {
        return typeof field !== "object" ? `${field} = $${index+1}`: `${field} = '${values[index]}'::jsonb`
      }
    ).join(', ');

    const query = {
      text: `UPDATE product
             SET ${setFields}, updated_at = NOW()
             WHERE id = ${id}`,
      values: values
    };

    const result = await client.query(query);

    if (result.rowCount === 0) {
      throw Boom.notFound(`Adjustment transaction with ID ${id} not found.`);
    }
  } finally {
    client.release();
  }
}


// Delete a product by ID
export async function deleteProductById(id: bigint): Promise<void> {
  try {
    const query = `DELETE FROM product WHERE id = ${id}`;
    await pool.query(query);
  } catch (error: any) {
    throw Boom.internal(error);
  }
}

// batch insert product
async function batchInsertProducts(products: any[]): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Prepare the insert statement
    const insertQuery = `
      INSERT INTO product (sku, name, price, image, description)
      VALUES ($1, $2, $3, $4, $5)
    `;

    // Execute the insert statement for each product
    for (const product of products) {
      const values = [
        product.sku || '', // Handle cases where sku is undefined
        product.name || '',
        product.price || 0,
        JSON.stringify(product.images) || '[]',
        product.description || '',
      ];

      // Check if SKU already exists in the database
      const skuExistsQuery = 'SELECT COUNT(1) FROM product WHERE sku = $1';
      const skuExistsResult = await client.query(skuExistsQuery, [values[0]]);

      if (skuExistsResult.rows[0].count === '0') {
        // SKU does not exist, perform the insert
        await client.query(insertQuery, values);
      }
    }

    await client.query('COMMIT');
  } catch (error: any) {
    await client.query('ROLLBACK');
    throw Boom.internal(error);
  } finally {
    client.release();
  }
}


export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
  batchInsertProducts
}