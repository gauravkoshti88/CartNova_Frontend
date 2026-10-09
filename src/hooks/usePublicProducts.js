import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getBestSellerProducts,
  getFeaturedProducts,
  getNewArrivalProducts,
  getPublicProducts,
  getProductsByCategorySlug,
  getProductsBySubCategorySlug,
  getProductsByChildCategorySlug,
} from "../redux/thunks/publicProductThunk";

export const usePublicProducts = (options = {}) => {
  const dispatch = useDispatch();

  const {
    getProducts = false,
    getFeatured = false,
    getBestSeller = false,
    getNewArrivals = false,

    // Category based products
    getCategoryProducts = false,
    getSubCategoryProducts = false,
    getChildCategoryProducts = false,

    categorySlug = "",
    subCategorySlug = "",
    childCategorySlug = "",

    params = {},
  } = options;

  const {
    products,
    featuredProducts,
    bestSellerProducts,
    newArrivalProducts,

    categoryProducts,
    subCategoryProducts,
    childCategoryProducts,

    loading,
    featuredLoading,
    bestSellerLoading,
    newArrivalLoading,

    categoryProductsLoading,
    subCategoryProductsLoading,
    childCategoryProductsLoading,

    error,

    pagination,
    categoryPagination,
    subCategoryPagination,
    childCategoryPagination,
  } = useSelector((state) => state.publicProduct);

  useEffect(() => {
    // ==========================
    // ALL PRODUCTS
    // ==========================

    if (getProducts) {
      dispatch(getPublicProducts(params));
    }

    // ==========================
    // FEATURED
    // ==========================

    if (getFeatured) {
      dispatch(getFeaturedProducts());
    }

    // ==========================
    // BEST SELLERS
    // ==========================

    if (getBestSeller) {
      dispatch(getBestSellerProducts());
    }

    // ==========================
    // NEW ARRIVALS
    // ==========================

    if (getNewArrivals) {
      dispatch(getNewArrivalProducts());
    }

    // ==========================
    // CATEGORY PRODUCTS
    // ==========================

    if (getCategoryProducts && categorySlug) {
      dispatch(
        getProductsByCategorySlug({
          slug: categorySlug,
          params,
        }),
      );
    }

    // ==========================
    // SUB CATEGORY PRODUCTS
    // ==========================

    if (getSubCategoryProducts && subCategorySlug) {
      dispatch(
        getProductsBySubCategorySlug({
          slug: subCategorySlug,
          params,
        }),
      );
    }

    // ==========================
    // CHILD CATEGORY PRODUCTS
    // ==========================

    if (getChildCategoryProducts && childCategorySlug) {
      dispatch(
        getProductsByChildCategorySlug({
          slug: childCategorySlug,
          params,
        }),
      );
    }
  }, [
    dispatch,

    getProducts,
    getFeatured,
    getBestSeller,
    getNewArrivals,

    getCategoryProducts,
    getSubCategoryProducts,
    getChildCategoryProducts,

    categorySlug,
    subCategorySlug,
    childCategorySlug,

    JSON.stringify(params),
  ]);

  return {
    // ==========================
    // ALL PRODUCTS
    // ==========================

    products,

    // ==========================
    // FEATURED / BEST / NEW
    // ==========================

    featuredProducts,
    bestSellerProducts,
    newArrivalProducts,

    // ==========================
    // CATEGORY PRODUCTS
    // ==========================

    categoryProducts,

    // ==========================
    // SUB CATEGORY PRODUCTS
    // ==========================

    subCategoryProducts,

    // ==========================
    // CHILD CATEGORY PRODUCTS
    // ==========================

    childCategoryProducts,

    // ==========================
    // LOADING STATES
    // ==========================

    loading,
    featuredLoading,
    bestSellerLoading,
    newArrivalLoading,

    categoryProductsLoading,
    subCategoryProductsLoading,
    childCategoryProductsLoading,

    error,

    // ==========================
    // ALL PRODUCTS PAGINATION
    // ==========================

    totalProducts: pagination?.totalProducts || 0,
    totalPages: pagination?.totalPages || 0,
    currentPage: pagination?.currentPage || 1,
    limit: pagination?.limit || 20,
    hasNextPage: pagination?.hasNextPage || false,
    hasPrevPage: pagination?.hasPrevPage || false,

    // ==========================
    // CATEGORY PAGINATION
    // ==========================

    categoryTotalProducts: categoryPagination?.totalProducts || 0,

    categoryTotalPages: categoryPagination?.totalPages || 0,

    categoryCurrentPage: categoryPagination?.currentPage || 1,

    categoryLimit: categoryPagination?.limit || 20,

    categoryHasNextPage: categoryPagination?.hasNextPage || false,

    categoryHasPrevPage: categoryPagination?.hasPrevPage || false,

    // ==========================
    // SUB CATEGORY PAGINATION
    // ==========================

    subCategoryTotalProducts: subCategoryPagination?.totalProducts || 0,

    subCategoryTotalPages: subCategoryPagination?.totalPages || 0,

    subCategoryCurrentPage: subCategoryPagination?.currentPage || 1,

    subCategoryLimit: subCategoryPagination?.limit || 20,

    subCategoryHasNextPage: subCategoryPagination?.hasNextPage || false,

    subCategoryHasPrevPage: subCategoryPagination?.hasPrevPage || false,

    // ==========================
    // CHILD CATEGORY PAGINATION
    // ==========================

    childCategoryTotalProducts: childCategoryPagination?.totalProducts || 0,

    childCategoryTotalPages: childCategoryPagination?.totalPages || 0,

    childCategoryCurrentPage: childCategoryPagination?.currentPage || 1,

    childCategoryLimit: childCategoryPagination?.limit || 20,

    childCategoryHasNextPage: childCategoryPagination?.hasNextPage || false,

    childCategoryHasPrevPage: childCategoryPagination?.hasPrevPage || false,
  };
};
