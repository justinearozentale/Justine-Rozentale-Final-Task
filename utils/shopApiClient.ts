import { type APIRequestContext } from '@playwright/test';

// Define the custom types
export interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: any;
}

export interface ProductsResponse {
  responseCode: number;
  products: Product[];
}

export interface ShopUser {
  name: string;
  email: string;
  password: string;
  title?: string;
  birth_date?: string;
  birth_month?: string;
  birth_year?: string;
  firstname?: string;
  lastname?: string;
  company?: string;
  address1?: string;
  address2?: string;
  country?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  mobile_number?: string;
}

export class ShopApiClient {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Fetch all products
   */
  async getProducts(): Promise<ProductsResponse> {
    const response = await this.request.get('/api/productsList');
    return response.json();
  }

  /**
   * Search for products using a keyword
   */
  async searchProducts(keyword: string): Promise<ProductsResponse> {
    const response = await this.request.post('/api/searchProduct', {
      form: { search_product: keyword }
    });
    return response.json();
  }

  /**
   * Create a new user account
   */
  async createAccount(user: ShopUser): Promise<void> {
    await this.request.post('/api/createAccount', {
      form: { ...user }
    });
  }

  /**
   * Delete an existing user account
   */
  async deleteAccount(email: string, password: string): Promise<void> {
    await this.request.delete('/api/deleteAccount', {
      form: { email, password }
    });
  }

  /**
   * Verify login credentials match
   */
  async verifyLogin(email: string, password: string): Promise<boolean> {
    const response = await this.request.post('/api/verifyLogin', {
      form: { email, password }
    });
    const body = await response.json();
    return body.responseCode === 200;
  }
}