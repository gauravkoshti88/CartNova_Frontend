import { createAsyncThunk } from "@reduxjs/toolkit";
import publicService from "../../services/publicService.js";

export const getPublicProducts = createAsyncThunk(
  "publicProducts/getPublicProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await publicService.getPublicProducts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

// Featured / Trending
export const getFeaturedProducts = createAsyncThunk(
  "publicProduct/getFeaturedProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await publicService.getFeaturedProducts();

      return data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch featured products",
      );
    }
  },
);

// Best Sellers
export const getBestSellerProducts = createAsyncThunk(
  "publicProduct/getBestSellerProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await publicService.getBestSellerProducts();

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch best sellers",
      );
    }
  },
);

// New Arrivals
export const getNewArrivalProducts = createAsyncThunk(
  "publicProduct/getNewArrivalProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await publicService.getNewArrivalProducts();

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch new arrivals",
      );
    }
  },
);

// PRODUCT DETAILS

export const getProductDetails = createAsyncThunk(
  "publicProduct/getProductDetails",

  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await publicService.getProductDetails(slug);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product details",
      );
    }
  },
);

// GET PRODUCT BY ID

export const getProductById = createAsyncThunk(
  "public/getProductById",
  async (productId, { rejectWithValue }) => {
    try {
      if (!productId) {
        return rejectWithValue("Product ID is required");
      }

      const response = await publicService.getProductById(productId);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch product",
      );
    }
  },
);

// GET OFFER PRODUCTS

export const getProductsOffer = createAsyncThunk(
  "products/getProductsOffer",
  async (_, { rejectWithValue }) => {
    try {
      const response = await publicService.getProductsOffer();

      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch offer products",
      );
    }
  },
);

// RELATED PRODUCTS

export const getRelatedProducts = createAsyncThunk(
  "publicProduct/getRelatedProducts",

  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await publicService.getRelatedProducts(slug);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch related products",
      );
    }
  },
);

// Get products by Category Slug
export const getProductsByCategorySlug = createAsyncThunk(
  "publicProducts/getProductsByCategorySlug",
  async ({ slug, params = {} }, { rejectWithValue }) => {
    try {
      const response = await publicService.getProductsByCategorySlug(
        slug,
        params,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch category products",
      );
    }
  },
);

// Get products by Sub Category Slug
export const getProductsBySubCategorySlug = createAsyncThunk(
  "publicProducts/getProductsBySubCategorySlug",
  async ({ slug, params = {} }, { rejectWithValue }) => {
    try {
      const response = await publicService.getProductsBySubCategorySlug(
        slug,
        params,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch sub category products",
      );
    }
  },
);

// Get products by Child Category Slug
export const getProductsByChildCategorySlug = createAsyncThunk(
  "publicProducts/getProductsByChildCategorySlug",
  async ({ slug, params = {} }, { rejectWithValue }) => {
    try {
      const response = await publicService.getProductsByChildCategorySlug(
        slug,
        params,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch child category products",
      );
    }
  },
);
