import { createAsyncThunk } from "@reduxjs/toolkit";
import categoryService from "../../services/publicCategoryService";

// ==========================
// GET ALL CATEGORIES
// ==========================

export const getCategories = createAsyncThunk(
  "category/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await categoryService.getCategories();

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories",
      );
    }
  },
);

// ==========================
// GET SUB CATEGORIES BY CATEGORY
// ==========================

export const getSubCategoriesByCategory = createAsyncThunk(
  "category/getSubCategoriesByCategory",
  async (categorySlug, { rejectWithValue }) => {
    try {
      const { data } =
        await categoryService.getSubCategoriesByCategory(categorySlug);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sub categories",
      );
    }
  },
);

export const getChildCategoriesByCategory = createAsyncThunk(
  "category/getChildCategoriesByCategory",
  async (categorySlug, { rejectWithValue }) => {
    try {
      const response =
        await categoryService.getChildCategoriesByCategory(categorySlug);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch child categories",
      );
    }
  },
);

// GET CHILD CATEGORIES BY SUB CATEGORY

export const getChildCategoriesBySubCategory = createAsyncThunk(
  "category/getChildCategoriesBySubCategory",
  async (subCategorySlug, { rejectWithValue }) => {
    try {
      const response =
        await categoryService.getChildCategoriesBySubCategory(subCategorySlug);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch child categories",
      );
    }
  },
);

// ==========================
// GET BRANDS BY CATEGORY
// ==========================

export const getBrandsByCategory = createAsyncThunk(
  "category/getBrandsByCategory",
  async (categorySlug, { rejectWithValue }) => {
    try {
      const { data } = await categoryService.getBrandsByCategory(categorySlug);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch brands by category",
      );
    }
  },
);
