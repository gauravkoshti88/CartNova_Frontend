import api from "./api";

const categoryService = {
  // GET ALL CATEGORIES
  getCategories: () => {
    return api.get("/api/public/categories");
  },

  // GET SUB CATEGORIES BY CATEGORY
  getSubCategoriesByCategory: (categorySlug) => {
    return api.get(`/api/public/categories/${categorySlug}/sub-categories`);
  },

  // GET CHILD CATEGORIES BY CATEGORY
  getChildCategoriesByCategory: (categorySlug) => {
    return api.get(`/api/public/categories/${categorySlug}/child-categories`);
  },

  // GET CHILD CATEGORIES BY SUB CATEGORY
  getChildCategoriesBySubCategory: (subCategorySlug) => {
    return api.get(
      `/api/public/categories/sub-category/${subCategorySlug}/child-categories`,
    );
  },

  // GET BRANDS BY CATEGORY
  getBrandsByCategory: (categorySlug) => {
    return api.get(`/api/public/categories/${categorySlug}/brands`);
  },
};

export default categoryService;
