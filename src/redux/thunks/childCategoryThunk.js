import { createAsyncThunk } from "@reduxjs/toolkit";
import childCategoryService from "../../services/adminService.js";

// ==========================
// GET ALL CHILD CATEGORIES
// ==========================

export const getAllChildCategory = createAsyncThunk(
  "childCategory/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await childCategoryService.getAllChildCategory();

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch child categories",
      );
    }
  },
);

export const getChildCategoriesBySubCategorySlug = createAsyncThunk(
  "childCategory/getBySubCategorySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const res =
        await childCategoryService.getChildCategoriesBySubCategorySlug(slug);

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch child categories",
      );
    }
  },
);

export const createChildCategory = createAsyncThunk(
  "childCategory/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await childCategoryService.createChildCategory(data);

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create child categories",
      );
    }
  },
);

// ==========================
// GET CHILD CATEGORY BY SLUG
// ==========================

export const getChildCategoryBySlug = createAsyncThunk(
  "childCategory/getBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await childCategoryService.getChildCategoryBySlug(slug);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch child category",
      );
    }
  },
);

// ==========================
// UPDATE CHILD CATEGORY
// ==========================

export const updateChildCategory = createAsyncThunk(
  "childCategory/update",
  async ({ slug, data }, { rejectWithValue }) => {
    try {
      const res = await childCategoryService.updateChildCategory(slug, data);

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update child category",
      );
    }
  },
);

// ==========================
// UPDATE CHILD CATEGORY STATUS
// ==========================

export const updateChildCategoryStatus = createAsyncThunk(
  "childCategory/updateStatus",
  async ({ slug, status }, { rejectWithValue }) => {
    try {
      const { data } = await childCategoryService.updateChildCategoryStatus(
        slug,
        status,
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update child category status",
      );
    }
  },
);

// ==========================
// DELETE CHILD CATEGORY
// ==========================

export const deleteChildCategoryBySlug = createAsyncThunk(
  "childCategory/delete",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } =
        await childCategoryService.deleteChildCategoryBySlug(slug);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete child category",
      );
    }
  },
);

// ==========================
// UNDO CHILD CATEGORY
// ==========================

export const undoChildCategoryBySlug = createAsyncThunk(
  "childCategory/undo",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await childCategoryService.undoChildCategoryBySlug(slug);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to undo child category",
      );
    }
  },
);
