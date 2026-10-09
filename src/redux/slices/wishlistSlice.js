import { createSlice } from "@reduxjs/toolkit";

import {
  getWishlist,
  addWishlistItem,
  removeWishlistItem,
  clearWishlist,
  mergeGuestWishlist,
} from "../thunks/wishlistThunk";

const initialState = {
  products: [],

  loading: false,
  error: null,
  message: null,
  success: false,

  initialized: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState,

  reducers: {
    // ======================================================
    // SET WISHLIST
    // ======================================================

    setWishlist: (state, action) => {
      state.products = action.payload || [];
      state.initialized = true;
    },

    // ======================================================
    // GUEST WISHLIST
    // ======================================================

    addGuestWishlist: (state, action) => {
      const productId = action.payload;

      if (!productId) return;

      const exists = state.products.some(
        (product) =>
          (typeof product === "string" ? product : product?._id)?.toString() ===
          productId.toString(),
      );

      if (!exists) {
        state.products.push(productId);
      }
    },

    removeGuestWishlist: (state, action) => {
      const productId = action.payload;

      state.products = state.products.filter((product) => {
        const id = typeof product === "string" ? product : product?._id;

        return id?.toString() !== productId?.toString();
      });
    },

    setGuestWishlist: (state, action) => {
      state.products = action.payload || [];
      state.initialized = true;
    },

    clearGuestWishlistState: (state) => {
      state.products = [];
    },

    // ======================================================
    // CLEAR ERROR
    // ======================================================

    clearWishlistError: (state) => {
      state.error = null;
    },

    // ======================================================
    // CLEAR MESSAGE
    // ======================================================

    clearWishlistMessage: (state) => {
      state.message = null;
      state.success = false;
    },

    // ======================================================
    // RESET SUCCESS
    // ======================================================

    resetWishlistSuccess: (state) => {
      state.success = false;
    },

    // ======================================================
    // RESET COMPLETE STATE
    // ======================================================

    clearWishlistState: (state) => {
      state.products = [];
      state.loading = false;
      state.error = null;
      state.message = null;
      state.success = false;
      state.initialized = false;
    },
  },

  extraReducers: (builder) => {
    // ======================================================
    // GET WISHLIST
    // ======================================================

    builder
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;

        state.products = action.payload?.wishlist?.products || [];

        state.message = action.payload?.message || null;
        state.error = null;
      })

      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.success = false;

        state.error = action.payload || "Failed to fetch wishlist";
      });

    // ======================================================
    // ADD
    // ======================================================

    builder
      .addCase(addWishlistItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(addWishlistItem.fulfilled, (state, action) => {
        state.loading = false;

        state.products = action.payload?.wishlist?.products || state.products;

        state.message = action.payload?.message || null;

        state.error = null;
      })

      .addCase(addWishlistItem.rejected, (state, action) => {
        state.loading = false;
        state.success = false;

        state.error = action.payload || "Failed to add product to wishlist";
      });

    // ======================================================
    // REMOVE
    // ======================================================

    builder
      .addCase(removeWishlistItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(removeWishlistItem.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || null;

        const removedProductId = action.meta?.arg?.toString();

        if (removedProductId) {
          state.products = state.products.filter((product) => {
            const id = typeof product === "string" ? product : product?._id;

            return id?.toString() !== removedProductId;
          });
        }
      })

      .addCase(removeWishlistItem.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload || "Failed to remove product from wishlist";
      });

    // ======================================================
    // CLEAR
    // ======================================================

    builder
      .addCase(clearWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(clearWishlist.fulfilled, (state, action) => {
        state.loading = false;

        state.success = action.payload?.success ?? true;

        state.products = [];

        state.message = action.payload?.message || null;

        state.error = null;
      })

      .addCase(clearWishlist.rejected, (state, action) => {
        state.loading = false;
        state.success = false;

        state.error = action.payload || "Failed to clear wishlist";
      });

    // ======================================================
    // MERGE GUEST WISHLIST
    // ======================================================

    builder
      .addCase(mergeGuestWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(mergeGuestWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;

        state.success = action.payload?.success ?? true;

        state.products = action.payload?.wishlist?.products || state.products;

        state.message = action.payload?.message || null;

        state.error = null;
      })

      .addCase(mergeGuestWishlist.rejected, (state, action) => {
        state.loading = false;
        state.success = false;

        state.error = action.payload || "Failed to merge wishlist";
      });
  },
});

export const {
  setWishlist,

  // Guest
  addGuestWishlist,
  removeGuestWishlist,
  setGuestWishlist,
  clearGuestWishlistState,

  // Messages/errors
  clearWishlistError,
  clearWishlistMessage,

  // Success
  resetWishlistSuccess,

  // Complete reset
  clearWishlistState,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
