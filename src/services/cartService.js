import api from "./api";

const cartService = {
  // ==========================================================
  // GET CART
  // ==========================================================

  getCart: async () => {
    const response = await api.get("/api/user/cart");

    return response.data;
  },

  // ==========================================================
  // ADD TO CART
  // ==========================================================

  addToCart: async ({ productId, variantId, quantity = 1 }) => {
    const response = await api.post("/api/user/cart/add", {
      productId,
      variantId,
      quantity,
    });

    return response.data;
  },

  // ==========================================================
  // UPDATE CART ITEM
  // ==========================================================

  updateCartItem: async ({ itemId, quantity }) => {
    const response = await api.patch(`/api/user/cart/item/${itemId}`, {
      quantity,
    });

    return response.data;
  },

  // ==========================================================
  // REMOVE CART ITEM
  // ==========================================================

  removeCartItem: async (itemId) => {
    const response = await api.delete(`/api/user/cart/item/${itemId}`);

    return response.data;
  },

  // ==========================================================
  // CLEAR CART
  // ==========================================================

  clearCart: async () => {
    const response = await api.delete("/api/user/cart/clear");

    return response.data;
  },

  // ==========================================================
  // MERGE GUEST CART
  // ==========================================================

  mergeGuestCart: async (items = []) => {
    const variants = items.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      quantity: Number(item.quantity) || 1,
    }));

    const response = await api.post("/api/user/cart/merge", {
      items: variants,
    });

    return response.data;
  },

  // ==========================================================
  // GET PRODUCT DETAILS BY ID
  // ==========================================================
  // Used to resolve guest cart items

  getProductDetailsById: async (productId) => {
    const response = await api.get(`/api/public/products/id/${productId}`);

    return response.data;
  },
};

export default cartService;
