import { createAsyncThunk } from "@reduxjs/toolkit";
import { categoryService } from "../../services/adminService";

export const getCategories = createAsyncThunk(
  "category/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await categoryService.getCategory();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch categories" },
      );
    }
  },
);

export const getAllDeletedCategories = createAsyncThunk(
  "category/getAllDeletedCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await categoryService.getAllDeletedCategory();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch deleted categories",
        },
      );
    }
  },
);

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await categoryService.addNewCategory(formData);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to create category" },
      );
    }
  },
);

export const getSelectedCategory = createAsyncThunk(
  "category/getSelectedCategory",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await categoryService.getSelectedCategory(slug);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch category" },
      );
    }
  },
);

export const updateCategoryStatus = createAsyncThunk(
  "category/updateCategoryStatus",
  async ({ slug, status }, { rejectWithValue }) => {
    try {
      const { data } = await categoryService.updateCategoryStatus(slug, {
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

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ slug, data }, { rejectWithValue }) => {
    try {
      const response = await categoryService.updateCategory(slug, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update category" },
      );
    }
  },
);

export const undoDeletedCategory = createAsyncThunk(
  "category/undoCategory",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await categoryService.undoDeletedCategory(slug);

      return { slug, ...data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to undo deleted category" },
      );
    }
  },
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await categoryService.deleteCategory(slug);

      return { slug, ...data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete category" },
      );
    }
  },
);
