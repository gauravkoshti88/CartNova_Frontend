import { createSlice } from "@reduxjs/toolkit";
import {
  getCategories,
  getSelectedCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllDeletedCategories,
  undoDeletedCategory,
  updateCategoryStatus,
} from "../thunks/categoryThunk";

const initialState = {
  categories: [],
  deletedCategories: [],

  loading: false,
  success: false,
  error: null,
  message: "",

  category: {
    _id: "",
    name: "",
    description: "",
    image: null,
    status: "active",
  },

  existSubCategory: [],
  productCount: 0,
};

const emptyCategory = {
  _id: "",
  name: "",
  description: "",
  image: null,
  status: "active",
};

const categorySlice = createSlice({
  name: "category",
  initialState,

  reducers: {
    updateCategoryField: (state, action) => {
      const { field, value } = action.payload;
      state.category[field] = value;
    },

    setCategory: (state, action) => {
      state.category = action.payload;
    },

    resetCategory: (state) => {
      state.category = emptyCategory;
    },

    clearCategoryState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= GET ALL =================

      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
      })

      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // ================= GET DELETED =================

      .addCase(getAllDeletedCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAllDeletedCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.deletedCategories = action.payload.categories;
      })

      .addCase(getAllDeletedCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // ================= GET SINGLE =================

      .addCase(getSelectedCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getSelectedCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;

        state.category = action.payload.category;
        state.existSubCategory = action.payload.existSubCategory;
        state.productCount = action.payload.productCount;
      })

      .addCase(getSelectedCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // ================= CREATE =================

      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        state.categories.unshift(action.payload.category);
      })

      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // ================= UPDATE =================

      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        const updatedCategory = action.payload.category;

        const index = state.categories.findIndex(
          (item) => item._id === updatedCategory._id,
        );

        if (index !== -1) {
          state.categories[index] = updatedCategory;
        }

        state.category = updatedCategory;
      })

      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // ================= UPDATE STATUS =================
      .addCase(updateCategoryStatus.fulfilled, (state, action) => {
        state.loading = false;

        const updatedCategory = action.payload.category;

        const index = state.categories.findIndex(
          (item) => item._id === updatedCategory._id,
        );

        if (index !== -1) {
          state.categories[index] = updatedCategory;
        }
      })
      // ================= UNDO =================

      .addCase(undoDeletedCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(undoDeletedCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        state.deletedCategories = state.deletedCategories.filter(
          (item) => item._id !== action.payload.category._id,
        );

        state.categories.unshift(action.payload.category);
      })

      .addCase(undoDeletedCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // ================= DELETE =================

      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteCategory.fulfilled, (state, action) => {
        const slug = action.payload?.slug || action.meta.arg;

        state.categories = state.categories.filter(
          (category) => category.slug !== slug,
        );
      })

      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export const {
  updateCategoryField,
  setCategory,
  resetCategory,
  clearCategoryState,
} = categorySlice.actions;

export default categorySlice.reducer;
