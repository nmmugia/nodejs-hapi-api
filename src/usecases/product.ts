import { product, createProduct, updateProduct } from '../models/product';
import productRepositoriesSQL from '../repositories/sql/product';
import {fetchAllProducts} from '../repositories/woo/product';

export const getAll = async (page: number, per_page: number) => {
  try {
    const products = await productRepositoriesSQL.getAll(page, per_page);
    return products;
  } catch (error) {
    throw error;
  }
};

export const getById = async (id: bigint) => {
  try {
    const product = await productRepositoriesSQL.getById(id);
    return product;
  } catch (error) {
    throw error;
  }
};

export const create = async (product: createProduct) => {
  try {
    const createdProduct = await productRepositoriesSQL.create(product);
    return createdProduct;
  } catch (error) {
    throw error;
  }
};

export const update = async (id: bigint, product: updateProduct) => {
  try {
    await productRepositoriesSQL.update(id, product);
  } catch (error) {
    throw error;
  }
};

export const deleteById = async (id: bigint) => {
  try {
    await productRepositoriesSQL.deleteById(id);
  } catch (error) {
    throw error;
  }
};

export const sync = async () => {
    try {
      const allProducts = await fetchAllProducts();
      // Process the retrieved products as needed
      // ...
      return allProducts;
    } catch (error) {
      throw error;
    }
};

export default { getAll, getById, create, update, deleteById, sync };
