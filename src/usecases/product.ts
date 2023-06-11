import { product, createProduct, updateProduct } from '../models/product';
import productRepositoriesSQL from '../repositories/sql/product';
import {fetchAllProducts} from '../repositories/woo/product';

export const getAll = async (page: number, per_page: number) => {
  try {
    const products = await productRepositoriesSQL.getAllProducts(page, per_page);
    return products;
  } catch (error) {
    throw error;
  }
};

export const getById = async (id: bigint) => {
  try {
    const product = await productRepositoriesSQL.getProductById(id);
    return product;
  } catch (error) {
    throw error;
  }
};

export const create = async (product: createProduct) => {
  try {
    const createdProduct = await productRepositoriesSQL.createProduct(product);
    return createdProduct;
  } catch (error) {
    throw error;
  }
};

export const update = async (id: bigint, product: updateProduct) => {
  try {
    await productRepositoriesSQL.updateProductById(id, product);
  } catch (error) {
    throw error;
  }
};

export const deleteById = async (id: bigint) => {
  try {
    await productRepositoriesSQL.deleteProductById(id);
  } catch (error) {
    throw error;
  }
};

export const sync = async () => {
    try {
      const allProducts = await fetchAllProducts();
      return allProducts;
    } catch (error) {
      throw error;
    }
};

export default { getAll, getById, create, update, deleteById, sync };
