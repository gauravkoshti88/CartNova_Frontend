import { createAsyncThunk } from "@reduxjs/toolkit";
import { subCategoryService } from "../../services/adminService";

// Get All Sub Categories
export const getAllSubCategories = createAsyncThunk(
  "subCategory/getAllSubCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await subCategoryService.getAllSubCategory();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch sub categories" },
      );
    }
  },
);

// Get All Sub Categories
export const getAllDeletedSubCategories = createAsyncThunk(
  "subCategory/getAllDeletedSubCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await subCategoryService.getAllDeletedSubCategory();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch all deleted sub categories",
        },
      );
    }
  },
);

// Get Sub Categories by Category
export const getSubCategoriesByCategory = createAsyncThunk(
  "subCategory/getSubCategories",
  async (categorySlug, { rejectWithValue }) => {
    try {
      const { data } =
        await subCategoryService.getSubCategoryByCategory(categorySlug);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch sub categories" },
      );
    }
  },
);

// Get Single Sub Category
export const getSelectedSubCategory = createAsyncThunk(
  "subCategory/getSelectedSubCategory",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await subCategoryService.getSelectedSubCategory(slug);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch sub category" },
      );
    }
  },
);

// Create
export const createSubCategory = createAsyncThunk(
  "subCategory/createSubCategory",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await subCategoryService.addNewSubCategory(formData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to create sub category" },
      );
    }
  },
);

// Update
export const updateSubCategory = createAsyncThunk(
  "subCategory/updateSubCategory",
  async ({ slug, data }, { rejectWithValue }) => {
    try {
      const res = await subCategoryService.updateSubCategory(slug, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update sub category" },
      );
    }
  },
);

// Update Status
export const updateSubCategoryStatus = createAsyncThunk(
  "subCategory/updateStatus",
  async ({ slug, status }, { rejectWithValue }) => {
    try {
      const { data } = await subCategoryService.updateSubCategoryStatus(slug, {
        status,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update status" },
      );
    }
  },
);

// Undo Sub-Category
export const undoDeletedSubCategory = createAsyncThunk(
  "subCategory/undoDeletedSubCategory",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await subCategoryService.undoDeletedSubCategory(slug);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to undo deleted sub category",
        },
      );
    }
  },
);

// Delete
export const deleteSubCategory = createAsyncThunk(
  "subCategory/deleteSubCategory",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await subCategoryService.deleteSubCategory(slug);

      return slug;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete sub category" },
      );
    }
  },
);
