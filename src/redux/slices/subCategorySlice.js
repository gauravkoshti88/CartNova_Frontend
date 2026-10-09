import { createSlice } from "@reduxjs/toolkit";
import {
  getSelectedSubCategory,
  createSubCategory,
  updateSubCategory,
  updateSubCategoryStatus,
  deleteSubCategory,
  getAllSubCategories,
  getSubCategoriesByCategory,
  getAllDeletedSubCategories,
  undoDeletedSubCategory,
} from "../thunks/subCategoryThunk";

const initialState = {
  subCategories: [],
  deletedSubCategories: [],

  loading: false,
  loaded: false,
  success: false,
  error: null,
  message: "",

  subCategory: {
    _id: "",
    category: "",
    name: "",
    description: "",
    image: null,
    status: "active",
  },

  productCount: 0,
};

const emptySubCategory = {
  _id: "",
  category: "",
  name: "",
  description: "",
  image: null,
  status: "active",
};

const subCategorySlice = createSlice({
  name: "subCategory",
  initialState,

  reducers: {
    updateSubCategoryField: (state, action) => {
      const { field, value } = action.payload;

      state.subCategory[field] = value;
    },

    setSubCategory: (state, action) => {
      state.subCategory = action.payload;
    },

    resetSubCategory: (state) => {
      state.subCategory = emptySubCategory;
    },

    clearSubCategoryState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = "";
    },

    clearSubCategories: (state) => {
      state.subCategories = [];
    },
  },

  extraReducers: (builder) => {
    builder

      // GET ALL
      .addCase(getAllSubCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.subCategories = action.payload.allSubCategory;
      })
      .addCase(getAllSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // GET ALL DELETED SUBCATEGORY
      .addCase(getAllDeletedSubCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllDeletedSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.subCategories = action.payload.deletedSubCategories;
      })
      .addCase(getAllDeletedSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // GET ALL By Category
      .addCase(getSubCategoriesByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSubCategoriesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.subCategories = action.payload.subCategory;
      })
      .addCase(getSubCategoriesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // GET SINGLE
      .addCase(getSelectedSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getSelectedSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.subCategory = action.payload.subCategory;
        state.productCount = action.payload.productCount;
      })

      .addCase(getSelectedSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch sub category";
      })

      // CREATE
      .addCase(createSubCategory.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })

      .addCase(createSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        state.subCategories.unshift(action.payload.subCategory);
      })

      .addCase(createSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload?.message || "Failed to create sub category";
      })

      // UPDATE
      .addCase(updateSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        const updatedSubCategory = action.payload.subCategory;

        const index = state.subCategories.findIndex(
          (item) => item._id === updatedSubCategory._id,
        );

        if (index !== -1) {
          state.subCategories[index] = updatedSubCategory;
        }

        state.subCategory = updatedSubCategory;
      })

      .addCase(updateSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Update failed";
      })

      // UPDATE STATUS
      .addCase(updateSubCategoryStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateSubCategoryStatus.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.subCategories.findIndex(
          (item) => item._id === action.payload.subCategory._id,
        );

        if (index !== -1) {
          state.subCategories[index] = action.payload.subCategory;
        }
      })

      .addCase(updateSubCategoryStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Status update failed";
      })

      // UNDO DELETED SUBCATEGORY
      .addCase(undoDeletedSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(undoDeletedSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        const index = state.deletedSubCategories.findIndex(
          (item) => item._id === action.payload.subCategory._id,
        );

        if (index !== -1) {
          state.deletedSubCategories[index] = action.payload.subCategory;
        }
      })

      .addCase(undoDeletedSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Update failed";
      })

      // DELETE
      .addCase(deleteSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        const slug = action.payload || action.meta.arg;

        state.subCategories = state.subCategories.filter(
          (subCategory) => subCategory.slug !== slug,
        );
      })

      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Delete failed";
      });
  },
});

export const {
  updateSubCategoryField,
  setSubCategory,
  resetSubCategory,
  clearSubCategoryState,
  clearSubCategories,
} = subCategorySlice.actions;

export default subCategorySlice.reducer;
