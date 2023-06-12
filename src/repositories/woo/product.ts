import axios from 'axios';

async function fetchProducts(page: number): Promise<any> {
  const url = `https://codetesting.jubelio.store/wp-json/wc/v3/products?per_page=50&page=${page}&orderby=date`;
  const username = process.env.WOO_CLIENT_KEY;
  const password = process.env.WOO_CLIENT_SECRET;
  const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
  try {
    const response = await axios.get(url, {
        headers: {
          Authorization: authHeader,
        },
      });
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching products from page ${page}:`, error);
    return [];
  }
}

export async function fetchAllProducts(): Promise<any[]> {
  let page = 1;
  const allProducts: any[] = [];

  // Fetch 2 at one iteration (2 workers concurrently)
  while (true) {
    const requests = [fetchProducts(page), fetchProducts(page + 1)];
    const results = await Promise.allSettled(requests);

    for (const result of results) {
      if (result.status === 'fulfilled') {
        const products = result.value;

        if (products.length === 0) {
          return allProducts; // Exit the loop when there are no more products
        }

        allProducts.push(...products);
      }
    }

    page += 2; // Increment the page by 2 for the next set of requests
  }
}
