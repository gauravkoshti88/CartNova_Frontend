const STORAGE_KEY = "gshop_guest_wishlist";

// ==========================================================
// GET
// ==========================================================

export const getGuestWishlist = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("GET GUEST WISHLIST ERROR:", error);
    return [];
  }
};

// ==========================================================
// SAVE
// ==========================================================

const saveGuestWishlist = (wishlist) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
};

// ==========================================================
// ADD
// ==========================================================

export const addGuestWishlistItem = (productId) => {
  const wishlist = getGuestWishlist();

  if (wishlist.includes(productId)) {
    return {
      success: false,
      message: "Product is already in wishlist",
      wishlist,
    };
  }

  const updatedWishlist = [...wishlist, productId];

  saveGuestWishlist(updatedWishlist);

  return {
    success: true,
    message: "Product added to wishlist",
    wishlist: updatedWishlist,
  };
};

// ==========================================================
// REMOVE
// ==========================================================

export const removeGuestWishlistItem = (productId) => {
  const wishlist = getGuestWishlist();

  const updatedWishlist = wishlist.filter((id) => id !== productId);

  saveGuestWishlist(updatedWishlist);

  return {
    success: true,
    message: "Product removed from wishlist",
    wishlist: updatedWishlist,
  };
};

// ==========================================================
// CHECK
// ==========================================================

export const isGuestWishlistItem = (productId) => {
  const wishlist = getGuestWishlist();

  return wishlist.includes(productId);
};

// ==========================================================
// CLEAR
// ==========================================================

export const clearGuestWishlist = () => {
  localStorage.removeItem(STORAGE_KEY);
};

// ==========================================================
// COUNT
// ==========================================================

export const getGuestWishlistCount = () => {
  return getGuestWishlist().length;
};
