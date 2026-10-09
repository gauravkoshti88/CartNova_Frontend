import api from "./api";

const wishlistService = {
  // ==========================================================
  // GET WISHLIST
  // ==========================================================

  getWishlist: () => {
    return api.get("/api/wishlist");
  },

  // ==========================================================
  // ADD
  // ==========================================================

  addToWishlist: (productId) => {
    return api.post("/api/wishlist/add", {
      productId,
    });
  },

  // ==========================================================
  // REMOVE
  // ==========================================================

  removeFromWishlist: (productId) => {
    return api.delete(`/api/wishlist/remove/${productId}`);
  },

  // ==========================================================
  // CLEAR
  // ==========================================================

  clearWishlist: () => {
    return api.delete("/api/wishlist/clear");
  },

  // ==========================================================
  // MERGE GUEST WISHLIST
  // ==========================================================

  mergeWishlist: (productIds) => {
    return api.post("/api/wishlist/merge", {
      productIds,
    });
  },
};

export default wishlistService;
