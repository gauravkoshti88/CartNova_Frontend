import { createAsyncThunk } from "@reduxjs/toolkit";
import { brandService } from "../../services/adminService";

// All brands thunk
export const getAllBrands = createAsyncThunk(
  "brand/getAllBrands",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await brandService.getAllBrand();

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch all brands" },
      );
    }
  },
);

// All Deleted brands thunk
export const getAllDeletedBrands = createAsyncThunk(
  "brand/getAllDeletedBrands",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await brandService.getAllDeletedBrands();

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch all deleted brands",
        },
      );
    }
  },
);

// Category-wise brands thunk
export const getBrandsByCategory = createAsyncThunk(
  "brand/getBrandsByCategory",
  async (categorySlug, { rejectWithValue }) => {
    try {
      const { data } = await brandService.getBrandByCategory(categorySlug);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch category brands" },
      );
    }
  },
);

// Get Single Brand
export const getSelectedBrand = createAsyncThunk(
  "brand/getSelectedBrand",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await brandService.getSelectedBrand(slug);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch brand",
        },
      );
    }
  },
);

// Create Brand
export const createBrand = createAsyncThunk(
  "brand/createBrand",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await brandService.addNewBrand(formData);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to create brand",
        },
      );
    }
  },
);

// Update Brand
export const updateBrand = createAsyncThunk(
  "brand/updateBrand",
  async ({ slug, data }, { rejectWithValue }) => {
    try {
      const res = await brandService.updateBrand(slug, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to update brand",
        },
      );
    }
  },
);

// Update Brand Status
export const updateBrandStatus = createAsyncThunk(
  "brand/updateBrandStatus",
  async ({ slug, status }, { rejectWithValue }) => {
    try {
      const { data } = await brandService.updateBrandStatus(slug, { status });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to update brand status",
        },
      );
    }
  },
);

// Undo Brand
export const undoDeletedBrand = createAsyncThunk(
  "brand/undoDeletedBrand",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await brandService.undoDeletedBrand(slug);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to undo deleted brand",
        },
      );
    }
  },
);

// Delete Brand
export const deleteBrand = createAsyncThunk(
  "brand/deleteBrand",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await brandService.deleteBrand(slug);

      return slug;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to delete brand",
        },
      );
    }
  },
);
