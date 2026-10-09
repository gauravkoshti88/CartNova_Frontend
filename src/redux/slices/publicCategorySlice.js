import { createSlice } from "@reduxjs/toolkit";

import {
  getBrandsByCategory,
  getCategories,
  getSubCategoriesByCategory,
  getChildCategoriesByCategory,
  getChildCategoriesBySubCategory,
} from "../thunks/publicCategoryThunk";

const initialState = {
  // ==========================
  // CATEGORIES
  // ==========================

  categories: [],
  categoriesLoading: false,
  categoriesError: null,

  // ==========================
  // SUB CATEGORIES
  // ==========================

  subCategories: [],
  subCategoriesLoading: false,
  subCategoriesError: null,

  subCategoriesCategorySlug: null,

  // ==========================
  // CHILD CATEGORIES
  // ==========================

  childCategories: [],
  childCategoriesLoading: false,
  childCategoriesError: null,

  childCategoriesCategorySlug: null,
  childCategoriesSubCategorySlug: null,

  // ==========================
  // BRANDS BY CATEGORY
  // ==========================

  categoryBrands: [],
  categoryBrandsLoading: false,
  categoryBrandsError: null,

  categoryBrandsCategorySlug: null,

  // ==========================
  // COMMON ERROR
  // ==========================

  error: null,
};

const publicCategorySlice = createSlice({
  name: "publicCategory",

  initialState,

  reducers: {
    // ==========================
    // CLEAR ALL ERRORS
    // ==========================

    clearPublicCategoryError: (state) => {
      state.error = null;

      state.categoriesError = null;
      state.subCategoriesError = null;
      state.childCategoriesError = null;
      state.categoryBrandsError = null;
    },

    // ==========================
    // CLEAR SUB CATEGORIES
    // ==========================

    clearSubCategories: (state) => {
      state.subCategories = [];
      state.subCategoriesCategorySlug = null;
    },

    // ==========================
    // CLEAR CHILD CATEGORIES
    // ==========================

    clearChildCategories: (state) => {
      state.childCategories = [];

      state.childCategoriesCategorySlug = null;
      state.childCategoriesSubCategorySlug = null;

      state.childCategoriesError = null;
    },

    // ==========================
    // CLEAR CATEGORY BRANDS
    // ==========================

    clearCategoryBrands: (state) => {
      state.categoryBrands = [];
      state.categoryBrandsCategorySlug = null;
    },

    // ==========================
    // CLEAR EVERYTHING
    // ==========================

    clearPublicCategory: (state) => {
      state.categories = [];
      state.subCategories = [];
      state.childCategories = [];
      state.categoryBrands = [];

      state.subCategoriesCategorySlug = null;

      state.childCategoriesCategorySlug = null;
      state.childCategoriesSubCategorySlug = null;

      state.categoryBrandsCategorySlug = null;

      state.categoriesError = null;
      state.subCategoriesError = null;
      state.childCategoriesError = null;
      state.categoryBrandsError = null;

      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ==========================
      // CATEGORIES
      // ==========================

      .addCase(getCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })

      .addCase(getCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;

        state.categories = action.payload.categories || [];
      })

      .addCase(getCategories.rejected, (state, action) => {
        state.categoriesLoading = false;

        state.categoriesError = action.payload || "Failed to fetch categories";
      })

      // ==========================
      // SUB CATEGORIES
      // ==========================

      .addCase(getSubCategoriesByCategory.pending, (state, action) => {
        state.subCategoriesLoading = true;
        state.subCategoriesError = null;

        state.subCategoriesCategorySlug = action.meta.arg.categorySlug;
      })

      .addCase(getSubCategoriesByCategory.fulfilled, (state, action) => {
        state.subCategoriesLoading = false;

        state.subCategories = action.payload.subCategories || [];
      })

      .addCase(getSubCategoriesByCategory.rejected, (state, action) => {
        state.subCategoriesLoading = false;

        state.subCategoriesError =
          action.payload || "Failed to fetch sub categories";
      })

      // ==========================
      // CHILD CATEGORIES BY CATEGORY
      // ==========================

      .addCase(getChildCategoriesByCategory.pending, (state, action) => {
        state.childCategoriesLoading = true;
        state.childCategoriesError = null;

        state.childCategoriesCategorySlug = action.meta.arg.categorySlug;

        state.childCategoriesSubCategorySlug = null;
      })

      .addCase(getChildCategoriesByCategory.fulfilled, (state, action) => {
        state.childCategoriesLoading = false;

        state.childCategories = action.payload.childCategories || [];
      })

      .addCase(getChildCategoriesByCategory.rejected, (state, action) => {
        state.childCategoriesLoading = false;

        state.childCategoriesError =
          action.payload || "Failed to fetch child categories";
      })

      // ==========================
      // CHILD CATEGORIES BY SUB CATEGORY
      // ==========================

      .addCase(getChildCategoriesBySubCategory.pending, (state, action) => {
        state.childCategoriesLoading = true;
        state.childCategoriesError = null;

        state.childCategoriesSubCategorySlug = action.meta.arg.subCategorySlug;

        state.childCategoriesCategorySlug = null;
      })

      .addCase(getChildCategoriesBySubCategory.fulfilled, (state, action) => {
        state.childCategoriesLoading = false;

        state.childCategories = action.payload.childCategories || [];
      })

      .addCase(getChildCategoriesBySubCategory.rejected, (state, action) => {
        state.childCategoriesLoading = false;

        state.childCategoriesError =
          action.payload || "Failed to fetch child categories";
      })

      // ==========================
      // BRANDS BY CATEGORY
      // ==========================

      .addCase(getBrandsByCategory.pending, (state, action) => {
        state.categoryBrandsLoading = true;
        state.categoryBrandsError = null;

        state.categoryBrandsCategorySlug = action.meta.arg.categorySlug;
      })

      .addCase(getBrandsByCategory.fulfilled, (state, action) => {
        state.categoryBrandsLoading = false;

        state.categoryBrands = action.payload.brands || [];
      })

      .addCase(getBrandsByCategory.rejected, (state, action) => {
        state.categoryBrandsLoading = false;

        state.categoryBrandsError =
          action.payload || "Failed to fetch brands by category";
      });
  },
});

export const {
  clearPublicCategoryError,
  clearSubCategories,
  clearChildCategories,
  clearCategoryBrands,
  clearPublicCategory,
} = publicCategorySlice.actions;

export default publicCategorySlice.reducer;
