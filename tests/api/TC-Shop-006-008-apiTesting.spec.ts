import { ShopApiClient } from '../../utils/shopApiClient';
import { test, expect } from '@playwright/test';

test.describe('Products API', () => {
  test('API: GET /api/productsList returns a valid product list @epic("API") @feature("Products API") @story("List all products") @severity("critical")', async ({ request }) => {
    
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

  test('API: POST /api/searchProduct filters items correctly @epic("API") @feature("Products API") @story("Search products") @severity("normal")', async ({ request }) => {
    const apiClient = new ShopApiClient(request);
    const searchKeyword = 'top';
    const body = await apiClient.searchProducts(searchKeyword);

    expect(body.responseCode).toBe(200);
    expect(body.products.length).toBeGreaterThan(0);

    const anyMatch = body.products.some(p => p.name.toLowerCase().includes(searchKeyword));
    expect(anyMatch).toBe(true);
  });

  test('API: POST /api/searchProduct with missing parameter returns 400 @epic("API") @feature("Products API") @story("Missing parameter") @severity("minor")', async ({ request }) => {
    // 👇 FIXED: Corrected the endpoint path to map exactly to the API specifications
    const response = await request.post('/api/searchProduct', { form: {} });
    const body = await response.json();

    expect(body.responseCode).toBe(400);
    expect(body.message).toBeDefined();
  });
});