// src/api/products.ts
import axios from "axios";
import { Product, Filter } from "../../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const productService = {
  // Get products with optional search and filters
  async getProducts(
    searchTerm?: string,
    filters?: Filter[],
    page: number = 1,
    limit: number = 10
  ): Promise<ProductListResponse> {
    try {
      const response = await axios.get<ProductListResponse>(
        `${API_BASE_URL}/products`,
        {
          params: {
            search: searchTerm,
            filters: filters?.map(f => f.value),
            page,
            limit
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products");
    }
  },

  // Get single product by ID
  async getProductById(id: string): Promise<Product> {
    try {
      const response = await axios.get<Product>(`${API_BASE_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw new Error("Product not found");
    }
  },

  // Get featured products (default home page)
  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    try {
      const response = await axios.get<Product[]>(
        `${API_BASE_URL}/products/featured`,
        { params: { limit } }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching featured products:", error);
      throw new Error("Failed to load featured products");
    }
  },

  // Get products by category
  async getProductsByCategory(
    category: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ProductListResponse> {
    try {
      const response = await axios.get<ProductListResponse>(
        `${API_BASE_URL}/products/category/${category}`,
        { params: { page, limit } }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${category} products:`, error);
      throw new Error(`Failed to load ${category} products`);
    }
  },

 
async getSearchSuggestions(term: string): Promise<string[]> {
    try {
      const response = await axios.get<string[]>(
        `${API_BASE_URL}/products/suggestions`,
        { params: { term } }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      return [];
    }
  }
};

// Response types
interface ProductListResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
