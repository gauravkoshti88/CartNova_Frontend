import { createSlice } from "@reduxjs/toolkit";

import {
  createChildCategory,
  getAllChildCategory,
  getChildCategoryBySlug,
  updateChildCategory,
  updateChildCategoryStatus,
  deleteChildCategoryBySlug,
  undoChildCategoryBySlug,
  getChildCategoriesBySubCategorySlug,
} from "../thunks/childCategoryThunk";

const emptyChildCategory = {
  name: "",
  subCategories: [],
  description: "",
  status: "active",
  image: null,
};

const initialState = {
  // ==========================
  // ALL CHILD CATEGORIES
  // ==========================

  childCategories: [],
  childCategoriesLoading: false,
  childCategoriesError: null,

  // ==========================
  // SINGLE CHILD CATEGORY
  // ==========================

  childCategory: emptyChildCategory,

  childCategoryLoading: false,
  childCategoryError: null,

  // ==========================
  // CREATE
  // ==========================

  createLoading: false,
  createError: null,
  createSuccess: false,

  // ==========================
  // UPDATE
  // ==========================

  updateLoading: false,
  updateError: null,
  updateSuccess: false,

  // ==========================
  // STATUS
  // ==========================

  statusLoading: false,
  statusError: null,

  // ==========================
  // DELETE
  // ==========================

  deleteLoading: false,
  deleteError: null,
  deleteSuccess: false,

  // ==========================
  // UNDO
  // ==========================

  undoLoading: false,
  undoError: null,
  undoSuccess: false,

  error: null,
};

const childCategorySlice = createSlice({
  name: "childCategory",

  initialState,

  reducers: {
    // ==========================
    // UPDATE FORM FIELD
    // ==========================

    updateChildCategoryField: (state, action) => {
      const { field, value } = action.payload;

      state.childCategory[field] = value;
    },

    // ==========================
    // SET CHILD CATEGORY
    // ==========================

    setChildCategory: (state, action) => {
      state.childCategory = action.payload;
    },

    // ==========================
    // RESET FORM
    // ==========================

    resetChildCategory: (state) => {
      state.childCategory = {
        ...emptyChildCategory,
        subCategories: [],
      };

      state.childCategoryError = null;
      state.createError = null;
      state.updateError = null;

      state.createSuccess = false;
      state.updateSuccess = false;
    },

    // ==========================
    // CLEAR ERRORS
    // ==========================

    clearChildCategoryError: (state) => {
      state.error = null;
      state.childCategoriesError = null;
      state.childCategoryError = null;

      state.createError = null;
      state.updateError = null;

      state.statusError = null;
      state.deleteError = null;
      state.undoError = null;
    },

    // ==========================
    // CLEAR SUCCESS
    // ==========================

    clearChildCategorySuccess: (state) => {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
      state.undoSuccess = false;
    },

    // ==========================
    // CLEAR SINGLE
    // ==========================

    clearChildCategory: (state) => {
      state.childCategory = {
        ...emptyChildCategory,
        subCategories: [],
      };

      state.childCategoryError = null;
    },

    // ==========================
    // CLEAR ALL
    // ==========================

    clearChildCategories: (state) => {
      state.childCategories = [];
      state.childCategoriesError = null;
    },

    // ==========================
    // RESET COMPLETE STATE
    // ==========================

    resetChildCategoryState: () => initialState,
  },

  extraReducers: (builder) => {
    builder

      // =====================================================
      // CREATE
      // =====================================================

      .addCase(createChildCategory.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })

      .addCase(createChildCategory.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = true;
        state.createError = null;

        const newChildCategory =
          action.payload.childCategory || action.payload.data;

        if (newChildCategory?._id) {
          state.childCategories.unshift(newChildCategory);
          state.childCategory = newChildCategory;
        }
      })

      .addCase(createChildCategory.rejected, (state, action) => {
        state.createLoading = false;
        state.createSuccess = false;

        state.createError = action.payload || "Failed to create child category";
      })

      .addCase(getChildCategoriesBySubCategorySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        getChildCategoriesBySubCategorySlug.fulfilled,
        (state, action) => {
          state.loading = false;
          state.childCategories = action.payload?.childCategories || [];
        },
      )

      .addCase(
        getChildCategoriesBySubCategorySlug.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },
      )

      // =====================================================
      // GET ALL
      // =====================================================

      .addCase(getAllChildCategory.pending, (state) => {
        state.childCategoriesLoading = true;
        state.childCategoriesError = null;
      })

      .addCase(getAllChildCategory.fulfilled, (state, action) => {
        state.childCategoriesLoading = false;

        state.childCategories = action.payload.childCategories || [];

        state.childCategoriesError = null;
      })

      .addCase(getAllChildCategory.rejected, (state, action) => {
        state.childCategoriesLoading = false;

        state.childCategoriesError =
          action.payload || "Failed to fetch child categories";
      })

      // =====================================================
      // GET SINGLE
      // =====================================================

      .addCase(getChildCategoryBySlug.pending, (state) => {
        state.childCategoryLoading = true;
        state.childCategoryError = null;
      })

      .addCase(getChildCategoryBySlug.fulfilled, (state, action) => {
        state.childCategoryLoading = false;

        state.childCategory =
          action.payload.childCategory ||
          action.payload.data ||
          emptyChildCategory;

        state.childCategoryError = null;
      })

      .addCase(getChildCategoryBySlug.rejected, (state, action) => {
        state.childCategoryLoading = false;

        state.childCategoryError =
          action.payload || "Failed to fetch child category";
      })

      // =====================================================
      // UPDATE
      // =====================================================

      .addCase(updateChildCategory.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })

      .addCase(updateChildCategory.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        state.updateError = null;

        const updatedChildCategory =
          action.payload.childCategory || action.payload.data;

        if (updatedChildCategory?._id) {
          state.childCategory = updatedChildCategory;

          const index = state.childCategories.findIndex(
            (item) => item._id === updatedChildCategory._id,
          );

          if (index !== -1) {
            state.childCategories[index] = updatedChildCategory;
          }
        }
      })

      .addCase(updateChildCategory.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = false;

        state.updateError = action.payload || "Failed to update child category";
      })

      // =====================================================
      // STATUS
      // =====================================================

      .addCase(updateChildCategoryStatus.pending, (state) => {
        state.statusLoading = true;
        state.statusError = null;
      })

      .addCase(updateChildCategoryStatus.fulfilled, (state, action) => {
        state.statusLoading = false;
        state.statusError = null;

        const updatedChildCategory =
          action.payload.childCategory || action.payload.data;

        if (updatedChildCategory?._id) {
          const index = state.childCategories.findIndex(
            (item) => item._id === updatedChildCategory._id,
          );

          if (index !== -1) {
            state.childCategories[index] = updatedChildCategory;
          }

          if (state.childCategory?._id === updatedChildCategory._id) {
            state.childCategory = updatedChildCategory;
          }
        }
      })

      .addCase(updateChildCategoryStatus.rejected, (state, action) => {
        state.statusLoading = false;

        state.statusError =
          action.payload || "Failed to update child category status";
      })

      // =====================================================
      // DELETE
      // =====================================================

      .addCase(deleteChildCategoryBySlug.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      })

      .addCase(deleteChildCategoryBySlug.fulfilled, (state, action) => {
        const slug = action.meta.arg;

        state.childCategories = state.childCategories.filter(
          (childCategory) => childCategory.slug !== slug,
        );
      })

      .addCase(deleteChildCategoryBySlug.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = false;

        state.deleteError = action.payload || "Failed to delete child category";
      })

      // =====================================================
      // UNDO
      // =====================================================

      .addCase(undoChildCategoryBySlug.pending, (state) => {
        state.undoLoading = true;
        state.undoError = null;
        state.undoSuccess = false;
      })

      .addCase(undoChildCategoryBySlug.fulfilled, (state, action) => {
        state.undoLoading = false;
        state.undoSuccess = true;
        state.undoError = null;

        const restoredChildCategory =
          action.payload.childCategory || action.payload.data;

        if (restoredChildCategory?._id) {
          const index = state.childCategories.findIndex(
            (item) => item._id === restoredChildCategory._id,
          );

          if (index !== -1) {
            state.childCategories[index] = restoredChildCategory;
          } else {
            state.childCategories.unshift(restoredChildCategory);
          }

          state.childCategory = restoredChildCategory;
        }
      })

      .addCase(undoChildCategoryBySlug.rejected, (state, action) => {
        state.undoLoading = false;
        state.undoSuccess = false;

        state.undoError = action.payload || "Failed to undo child category";
      });
  },
});

export const {
  updateChildCategoryField,
  setChildCategory,
  resetChildCategory,
  clearChildCategoryError,
  clearChildCategorySuccess,
  clearChildCategory,
  clearChildCategories,
  resetChildCategoryState,
} = childCategorySlice.actions;

export default childCategorySlice.reducer;
