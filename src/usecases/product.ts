import { createProductForm, updateProductForm } from '../models/product';
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

export const create = async (product: createProductForm) => {
  try {
    const createdProduct = await productRepositoriesSQL.createProduct(product);
    return createdProduct;
  } catch (error) {
    throw error;
  }
};

export const update = async (id: bigint, product: updateProductForm) => {
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

    const batchSize = 50; // Number of products to insert in each batch
    const totalProducts = allProducts.length;
    let insertedCount = 0;

    while (insertedCount < totalProducts) {
      const batchProducts = allProducts.slice(insertedCount, insertedCount + batchSize);

      await productRepositoriesSQL.batchInsertProducts(batchProducts);

      insertedCount += batchProducts.length;
    }

    console.log('Sync completed successfully.');
  } catch (error) {
    throw error;
  }
};


export default { getAll, getById, create, update, deleteById, sync };
