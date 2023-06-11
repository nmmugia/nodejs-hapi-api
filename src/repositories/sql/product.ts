import { Pool, QueryResult } from 'pg';
import { product, createProduct, updateProduct } from '../models/product';

// Create a connection pool
const pool = new Pool({
  connectionString: 'your-postgres-connection-string',
});

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
export async function updateProduct(id: bigint, productData: updateProduct): Promise<void> {
  try {
    const query = `
      UPDATE product
      SET sku = $1, name = $2, price = $3, image = $4, description = $5
      WHERE id = $6
    `;
    const values = [productData.sku, productData.name, productData.price, productData.image, productData.description, id];
    await pool.query(query, values);
  } catch (error) {
    throw error;
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
