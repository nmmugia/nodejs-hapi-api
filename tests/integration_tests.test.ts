import { exec } from 'child_process';
const baseURL = 'http://localhost:4000'; // Replace with the appropriate base URL of your API

describe('API Integration Tests', () => {
  exec(`curl ${baseURL}/login`, (error, stdout, stderr) => {
    expect(stdout).toContain('HTTP/1.1 200'); // Assert the response status code
  });
  describe('Products API', () => {
    it('should return all products', (done) => {
      exec(`curl ${baseURL}/products?per_page=5&page=1`, (error, stdout, stderr) => {
        expect(stdout).toContain('HTTP/1.1 200'); // Assert the response status code
        done();
      });
    });

    it('should return a specific product by ID', (done) => {
      exec(`curl ${baseURL}/products/1`, (error, stdout, stderr) => {
        expect(stdout).toContain('HTTP/1.1 200'); // Assert the response status code
        done();
      });
    });

    it('should create a new product', (done) => {
      const productData = {
        sku: 'susis-1',
        name: 'baju',
        price: '10.02',
        image: 'https://radarlampung.disway.id/upload/891504aea3381619b7bbf4670f20b785.jpg',
        description: 'ini baju',
      };

      exec(
        `curl -X POST ${baseURL}/products -d '${JSON.stringify(productData)}' -H 'Content-Type: application/json'`,
        (error, stdout, stderr) => {
          expect(stdout).toContain('HTTP/1.1 201'); // Assert the response status code
          done();
        }
      );
    });

  });

  describe('Adjustment Transactions API', () => {
  });

  describe('User API', () => {
  });

});
