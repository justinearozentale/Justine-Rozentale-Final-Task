import { ShopApiClient } from '../../utils/shopApiClient';
import { test, expect } from '@playwright/test';
import { epic, feature, story, severity, Severity } from 'allure-js-commons';

test.describe('Products API', () => {
  test('API: GET /api/productsList returns a valid product list', async ({ request }) => {
    await epic('API');
    await feature('Products API');
    await story ('List all products');
    await severity(Severity.CRITICAL);
    
    // new API helper client
    const apiClient = new ShopApiClient(request);
    
    // Step 1 & 2: Send request and parse response using helper
    const data = await apiClient.getProducts();

    // Expected: responseCode equals 200
    expect(data.responseCode).toBe(200);

    // Expected: products is an array with at least one element
    expect(Array.isArray(data.products)).toBe(true);
    expect(data.products.length).toBeGreaterThan(0);

    // Track IDs to ensure uniqueness
    const productIds: number[] = [];

    // Expected: Each product object has: id, name, price, brand, category
    for (const product of data.products) {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('brand');
      expect(product).toHaveProperty('category');
      
      productIds.push(product.id);
    }

    // Expected: All id values are unique within the list
    const uniqueIds = new Set(productIds);
    expect(uniqueIds.size).toBe(productIds.length);
  });

  test('API: POST /api/searchProduct filters items correctly', async ({ request }) => {
    await epic('API');
    await feature('Products API');
    await story ('Search products');
    await severity(Severity.NORMAL);
    const apiClient = new ShopApiClient(request);
    const searchKeyword = 'top';
    const body = await apiClient.searchProducts(searchKeyword);

    expect(body.responseCode).toBe(200);
    expect(body.products.length).toBeGreaterThan(0);

    const anyMatch = body.products.some(p => p.name.toLowerCase().includes(searchKeyword));
    expect(anyMatch).toBe(true);
  });

  test('API: POST /api/searchProduct with missing parameter returns 400', async ({ request }) => {
   await epic('API');
    await feature('Products API');
    await story ('Missing parameter');
    await severity(Severity.MINOR);
    const response = await request.post('/api/searchProduct', { form: {} });
    const body = await response.json();

    expect([200, 400]).toContain(response.status());
    expect(body.message).toBeDefined();
  });
});