import { createSlice } from "@reduxjs/toolkit";

import {
  getBestSellerProducts,
  getFeaturedProducts,
  getNewArrivalProducts,
  getPublicProducts,
  getProductDetails,
  getRelatedProducts,
  getProductsByCategorySlug,
  getProductsBySubCategorySlug,
  getProductsByChildCategorySlug,
  getProductById,
  getProductsOffer,
} from "../thunks/publicProductThunk";

const initialState = {
  products: [],

  featuredProducts: [],
  bestSellerProducts: [],
  newArrivalProducts: [],

  // Category / SubCategory / ChildCategory Products
  categoryProducts: [],
  subCategoryProducts: [],
  childCategoryProducts: [],

  offerProducts: [],
  offerProductsLoading: false,
  offerProductsError: null,

  product: null,

  productLoading: false,
  productError: null,

  relatedProducts: [],

  loading: false,
  featuredLoading: false,
  bestSellerLoading: false,
  newArrivalLoading: false,

  categoryProductsLoading: false,
  subCategoryProductsLoading: false,
  childCategoryProductsLoading: false,

  detailsLoading: false,
  relatedLoading: false,

  error: null,

  pagination: {
    totalProducts: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 12,
  },

  categoryPagination: {
    totalProducts: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 12,
    hasNextPage: false,
    hasPrevPage: false,
  },

  subCategoryPagination: {
    totalProducts: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 12,
    hasNextPage: false,
    hasPrevPage: false,
  },

  childCategoryPagination: {
    totalProducts: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 12,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

const publicProductSlice = createSlice({
  name: "publicProduct",

  initialState,

  reducers: {
    clearProductDetails: (state) => {
      state.product = null;
      state.relatedProducts = [];
    },

    clearProducts: (state) => {
      state.products = [];
    },

    clearCategoryProducts: (state) => {
      state.categoryProducts = [];

      state.categoryPagination = {
        totalProducts: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 12,
        hasNextPage: false,
        hasPrevPage: false,
      };
    },

    clearSubCategoryProducts: (state) => {
      state.subCategoryProducts = [];

      state.subCategoryPagination = {
        totalProducts: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 12,
        hasNextPage: false,
        hasPrevPage: false,
      };
    },

    clearChildCategoryProducts: (state) => {
      state.childCategoryProducts = [];

      state.childCategoryPagination = {
        totalProducts: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 12,
        hasNextPage: false,
        hasPrevPage: false,
      };
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ==========================
      // ALL PRODUCTS
      // ==========================

      .addCase(getPublicProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getPublicProducts.fulfilled, (state, action) => {
        state.loading = false;

        const {
          products = [],
          currentPage = 1,
          totalProducts = 0,
          totalPages = 0,
          limit = 20,
          hasNextPage = false,
          hasPrevPage = false,
        } = action.payload;

        if (currentPage === 1) {
          state.products = products;
        } else {
          state.products = [
            ...state.products,
            ...products.filter(
              (newProduct) =>
                !state.products.some(
                  (oldProduct) => oldProduct._id === newProduct._id,
                ),
            ),
          ];
        }

        state.pagination = {
          totalProducts,
          totalPages,
          currentPage,
          limit,
          hasNextPage,
          hasPrevPage,
        };
      })

      .addCase(getPublicProducts.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed to fetch products";
      })

      .addCase(getProductsOffer.pending, (state) => {
        state.offerProductsLoading = true;
        state.offerProductsError = null;
      })

      .addCase(getProductsOffer.fulfilled, (state, action) => {
        state.offerProductsLoading = false;
        state.offerProductsError = null;

        state.offerProducts = action.payload.products || [];
      })

      .addCase(getProductsOffer.rejected, (state, action) => {
        state.offerProductsLoading = false;
        state.offerProductsError =
          action.payload || "Failed to fetch offer products";
      })

      // ==========================
      // FEATURED / TRENDING
      // ==========================

      .addCase(getFeaturedProducts.pending, (state) => {
        state.featuredLoading = true;
        state.error = null;
      })

      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.featuredLoading = false;

        state.featuredProducts = action.payload.products || [];
      })

      .addCase(getFeaturedProducts.rejected, (state, action) => {
        state.featuredLoading = false;

        state.error = action.payload || "Failed to fetch featured products";
      })

      // ==========================
      // BEST SELLERS
      // ==========================

      .addCase(getBestSellerProducts.pending, (state) => {
        state.bestSellerLoading = true;
        state.error = null;
      })

      .addCase(getBestSellerProducts.fulfilled, (state, action) => {
        state.bestSellerLoading = false;

        state.bestSellerProducts = action.payload.products || [];
      })

      .addCase(getBestSellerProducts.rejected, (state, action) => {
        state.bestSellerLoading = false;

        state.error = action.payload || "Failed to fetch best seller products";
      })

      // ==========================
      // NEW ARRIVALS
      // ==========================

      .addCase(getNewArrivalProducts.pending, (state) => {
        state.newArrivalLoading = true;
        state.error = null;
      })

      .addCase(getNewArrivalProducts.fulfilled, (state, action) => {
        state.newArrivalLoading = false;

        state.newArrivalProducts = action.payload.products || [];
      })

      .addCase(getNewArrivalProducts.rejected, (state, action) => {
        state.newArrivalLoading = false;

        state.error = action.payload || "Failed to fetch new arrival products";
      })

      // ==========================
      // CATEGORY PRODUCTS
      // ==========================

      .addCase(getProductsByCategorySlug.pending, (state) => {
        state.categoryProductsLoading = true;
        state.error = null;
      })

      .addCase(getProductsByCategorySlug.fulfilled, (state, action) => {
        state.categoryProductsLoading = false;

        const { products = [], pagination = {} } = action.payload;

        const {
          currentPage = 1,
          totalProducts = 0,
          totalPages = 0,
          limit = 12,
          hasNextPage = false,
          hasPrevPage = false,
        } = pagination;

        if (currentPage === 1) {
          state.categoryProducts = products;
        } else {
          state.categoryProducts = [
            ...state.categoryProducts,
            ...products.filter(
              (newProduct) =>
                !state.categoryProducts.some(
                  (oldProduct) => oldProduct._id === newProduct._id,
                ),
            ),
          ];
        }

        state.categoryPagination = {
          totalProducts,
          totalPages,
          currentPage,
          limit,
          hasNextPage,
          hasPrevPage,
        };
      })

      .addCase(getProductsByCategorySlug.rejected, (state, action) => {
        state.categoryProductsLoading = false;

        state.error = action.payload || "Failed to fetch category products";
      })

      // ==========================
      // SUB CATEGORY PRODUCTS
      // ==========================

      .addCase(getProductsBySubCategorySlug.pending, (state) => {
        state.subCategoryProductsLoading = true;
        state.error = null;
      })

      .addCase(getProductsBySubCategorySlug.fulfilled, (state, action) => {
        state.subCategoryProductsLoading = false;

        const { products = [], pagination = {} } = action.payload;

        const {
          currentPage = 1,
          totalProducts = 0,
          totalPages = 0,
          limit = 12,
          hasNextPage = false,
          hasPrevPage = false,
        } = pagination;

        if (currentPage === 1) {
          state.subCategoryProducts = products;
        } else {
          state.subCategoryProducts = [
            ...state.subCategoryProducts,
            ...products.filter(
              (newProduct) =>
                !state.subCategoryProducts.some(
                  (oldProduct) => oldProduct._id === newProduct._id,
                ),
            ),
          ];
        }

        state.subCategoryPagination = {
          totalProducts,
          totalPages,
          currentPage,
          limit,
          hasNextPage,
          hasPrevPage,
        };
      })

      .addCase(getProductsBySubCategorySlug.rejected, (state, action) => {
        state.subCategoryProductsLoading = false;

        state.error = action.payload || "Failed to fetch sub category products";
      })

      // ==========================
      // CHILD CATEGORY PRODUCTS
      // ==========================

      .addCase(getProductsByChildCategorySlug.pending, (state) => {
        state.childCategoryProductsLoading = true;
        state.error = null;
      })

      .addCase(getProductsByChildCategorySlug.fulfilled, (state, action) => {
        state.childCategoryProductsLoading = false;

        const { products = [], pagination = {} } = action.payload;

        const {
          currentPage = 1,
          totalProducts = 0,
          totalPages = 0,
          limit = 12,
          hasNextPage = false,
          hasPrevPage = false,
        } = pagination;

        if (currentPage === 1) {
          state.childCategoryProducts = products;
        } else {
          state.childCategoryProducts = [
            ...state.childCategoryProducts,
            ...products.filter(
              (newProduct) =>
                !state.childCategoryProducts.some(
                  (oldProduct) => oldProduct._id === newProduct._id,
                ),
            ),
          ];
        }

        state.childCategoryPagination = {
          totalProducts,
          totalPages,
          currentPage,
          limit,
          hasNextPage,
          hasPrevPage,
        };
      })

      .addCase(getProductsByChildCategorySlug.rejected, (state, action) => {
        state.childCategoryProductsLoading = false;

        state.error =
          action.payload || "Failed to fetch child category products";
      })

      // ==========================
      // PRODUCT DETAILS
      // ==========================

      .addCase(getProductDetails.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
        state.product = null;
      })

      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;

        state.product = action.payload.product || null;
      })

      .addCase(getProductDetails.rejected, (state, action) => {
        state.detailsLoading = false;

        state.product = null;

        state.error = action.payload || "Failed to fetch product details";
      })

      // GET PRODUCT BY ID

      .addCase(getProductById.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })

      .addCase(getProductById.fulfilled, (state, action) => {
        state.productLoading = false;

        state.product =
          action.payload?.product || action.payload?.data?.product || null;
      })

      .addCase(getProductById.rejected, (state, action) => {
        state.productLoading = false;

        state.productError = action.payload || "Failed to fetch product";
      })

      // ==========================
      // RELATED PRODUCTS
      // ==========================

      .addCase(getRelatedProducts.pending, (state) => {
        state.relatedLoading = true;
      })

      .addCase(getRelatedProducts.fulfilled, (state, action) => {
        state.relatedLoading = false;

        state.relatedProducts = action.payload.products || [];
      })

      .addCase(getRelatedProducts.rejected, (state, action) => {
        state.relatedLoading = false;

        state.relatedProducts = [];

        state.error = action.payload || "Failed to fetch related products";
      });
  },
});

export const {
  clearProductDetails,
  clearProducts,
  clearCategoryProducts,
  clearSubCategoryProducts,
  clearChildCategoryProducts,
  clearError,
} = publicProductSlice.actions;

export default publicProductSlice.reducer;
