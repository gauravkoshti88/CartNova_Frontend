import api from "./api";

export const dashboardService = {
  getDashboard: () => api.get("/api/admin/dashboard"),
};

export const categoryService = {
  addNewCategory: (data) => api.post("/api/admin/add-category", data),

  getCategory: () => api.get("/api/admin/category-list"),

  getAllDeletedCategory: () => api.get("/api/admin/deleted-category-list"),

  getSelectedCategory: (slug) => api.get(`/api/admin/category/${slug}`),

  updateCategory: (slug, data) =>
    api.put(`/api/admin/update-category/${slug}`, data),

  updateCategoryStatus: (slug, data) =>
    api.patch(`/api/admin/update-category-status/${slug}`, data),

  undoDeletedCategory: (slug) =>
    api.put(`/api/admin/undo-deleted-category/${slug}`),

  deleteCategory: (slug) => api.delete(`/api/admin/delete-category/${slug}`),
};

export const subCategoryService = {
  addNewSubCategory: (data) =>
    api.post("/api/admin/category/add-sub-category", data),

  getAllSubCategory: () => api.get("/api/admin/category/get-all-sub-category"),

  getAllDeletedSubCategory: () =>
    api.get("/api/admin/category/get-all-deleted-sub-category"),

  getSubCategoryByCategory: (categorySlug) =>
    api.get(`/api/admin/category/get-sub-category/${categorySlug}`),

  getSelectedSubCategory: (slug) =>
    api.get(`/api/admin/category/sub-category/${slug}`),

  updateSubCategory: (slug, data) =>
    api.put(`/api/admin/category/update-sub-category/${slug}`, data),

  updateSubCategoryStatus: (slug, data) =>
    api.patch(`/api/admin/category/update-sub-category-status/${slug}`, data),

  undoDeletedSubCategory: (slug) =>
    api.put(`/api/admin/category/undo-deleted-sub-category/${slug}`),

  deleteSubCategory: (slug) =>
    api.delete(`/api/admin/category/delete-sub-category/${slug}`),
};

const childCategoryService = {
  // GET ALL CHILD CATEGORIES
  getAllChildCategory: () => {
    return api.get("/api/admin/child-category");
  },

  getChildCategoriesBySubCategorySlug: (slug) => {
    return api.get(
      `/api/admin/child-category/sub-category/${slug}/child-categories`,
    );
  },

  createChildCategory: (data) => {
    return api.post("/api/admin/child-category/create", data);
  },

  // GET CHILD CATEGORY BY SLUG
  getChildCategoryBySlug: (slug) => {
    return api.get(`/api/admin/child-category/${slug}`);
  },

  // UPDATE CHILD CATEGORY
  updateChildCategory: (slug, data) => {
    return api.put(`/api/admin/child-category/update/${slug}`, data);
  },

  // UPDATE CHILD CATEGORY STATUS
  updateChildCategoryStatus: (slug, status) => {
    return api.patch(`/api/admin/child-category/update/${slug}/status`, {
      status,
    });
  },

  // DELETE CHILD CATEGORY
  deleteChildCategoryBySlug: (slug) => {
    return api.patch(`/api/admin/child-category/${slug}/delete`);
  },

  // UNDO CHILD CATEGORY
  undoChildCategoryBySlug: (slug) => {
    return api.patch(`/api/admin/child-category/${slug}/undo`);
  },
};

export default childCategoryService;

export const brandService = {
  addNewBrand: (data) => api.post("/api/admin/category/add-new-brand", data),

  getAllBrand: () => api.get(`/api/admin/category/get-all-brands`),

  getAllDeletedBrands: () =>
    api.get("/api/admin/category/get-all-deleted-brand"),

  getBrandByCategory: (categorySlug) =>
    api.get(`/api/admin/category/get-brand/${categorySlug}`),

  getSelectedBrand: (slug) => api.get(`/api/admin/category/brand/${slug}`),

  updateBrand: (slug, data) =>
    api.put(`/api/admin/category/update-brand/${slug}`, data),

  updateBrandStatus: (slug, data) =>
    api.patch(`/api/admin/category/update-brand-status/${slug}`, data),

  undoDeletedBrand: (slug) =>
    api.put(`/api/admin/category/undo-deleted-brand/${slug}`),

  deleteBrand: (slug) => api.delete(`/api/admin/category/delete-brand/${slug}`),
};

export const productService = {
  addNewProduct: (formData) => api.post("/api/admin/add-new-product", formData),

  getAllProducts: () => api.get("/api/admin/get-all-products"),

  getProductBySlug: (id) => api.get(`/api/admin/get-product/${id}`),

  updateProduct: (id, formData) =>
    api.put(`/api/admin/update-product/${id}`, formData),

  updateProductStatus: (id, data) =>
    api.patch(`/api/admin/update-product-status/${id}`, data),
};
