import api from "./api";

const publicService = {
  // ==========================================================
  // PRODUCTS
  // ==========================================================

  getPublicProducts: (params = {}) => {
    return api.get("/api/public/products", {
      params,
    });
  },

  getFeaturedProducts: () => {
    return api.get("/api/public/products/featured");
  },

  getBestSellerProducts: () => {
    return api.get("/api/public/products/best-sellers");
  },

  getNewArrivalProducts: () => {
    return api.get("/api/public/products/new-arrivals");
  },

  // ==========================================================
  // PRODUCT DETAILS
  // ==========================================================

  getProductDetails: (slug) => {
    return api.get(`/api/public/product/${slug}`);
  },

  // ==========================================================
  // PRODUCT BY ID
  // ==========================================================

  getProductById: (id) => {
    return api.get(`/api/public/product/id/${id}`);
  },

  // ==========================================================
  // OFFER PRODUCTS
  // ==========================================================

  getProductsOffer: () => {
    return api.get("/api/public/products/discounted");
  },

  // ==========================================================
  // RELATED PRODUCTS
  // ==========================================================

  getRelatedProducts: (slug) => {
    return api.get(`/api/public/products/related/${slug}`);
  },

  // ==========================================================
  // CATEGORY PRODUCTS
  // ==========================================================

  getProductsByCategorySlug: (slug, params = {}) => {
    return api.get(`/api/public/products/category/${slug}`, {
      params,
    });
  },

  // ==========================================================
  // SUB CATEGORY PRODUCTS
  // ==========================================================

  getProductsBySubCategorySlug: (slug, params = {}) => {
    return api.get(`/api/public/products/subcategory/${slug}`, {
      params,
    });
  },

  // ==========================================================
  // CHILD CATEGORY PRODUCTS
  // ==========================================================

  getProductsByChildCategorySlug: (slug, params = {}) => {
    return api.get(`/api/public/products/child-category/${slug}`, {
      params,
    });
  },
};

export default publicService;
