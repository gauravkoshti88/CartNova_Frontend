import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { productService } from "../../services/adminService";

export const addNewProduct = createAsyncThunk(
  "product/addNewProduct",
  async (formData, thunkAPi) => {
    try {
      const response = await productService.addNewProduct(formData);

      return response.data;
    } catch (error) {
      return thunkAPi.rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Something went wrong",
        },
      );
    }
  },
);

export const getAllProducts = createAsyncThunk(
  "product/getAllProducts",
  async (__, { rejectWithValue }) => {
    try {
      const response = await productService.getAllProducts();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Get Products Error",
        },
      );
    }
  },
);

export const getProductBySlug = createAsyncThunk(
  "product/getProductBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await productService.getProductBySlug(slug);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Get Product Error",
        },
      );
    }
  },
);

export const updateProduct = createAsyncThunk(
  "product/update",
  async ({ slug, formData }, thunkAPI) => {
    try {
      const { data } = await productService.updateProduct(slug, formData);

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const updateProductStatus = createAsyncThunk(
  "product/updateProductStatus",
  async ({ slug, status }, { rejectWithValue }) => {
    try {
      const { data } = await productService.updateProductStatus(slug, {
        status,
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to update product status",
        },
      );
    }
  },
);
