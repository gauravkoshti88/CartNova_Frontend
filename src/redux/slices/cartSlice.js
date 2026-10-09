import { createSlice } from "@reduxjs/toolkit";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeGuestCart,
} from "../thunks/cartThunk";

const initialState = {
  // CART ITEMS

  items: [],

  // LOADING STATES

  loading: false,
  adding: false,
  updating: false,
  removing: false,
  clearing: false,
  merging: false,
  resolving: false,

  // REQUEST STATE

  initialized: false,
  success: false,

  // MESSAGES

  message: "",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    // CLEAR MESSAGE

    clearCartMessage: (state) => {
      state.success = false;
      state.message = "";
    },

    // CLEAR ERROR

    clearCartError: (state) => {
      state.error = null;
    },

    // RESET CART STATE

    resetCartState: (state) => {
      state.items = [];

      state.loading = false;
      state.adding = false;
      state.updating = false;
      state.removing = false;
      state.clearing = false;
      state.merging = false;
      state.resolving = false;

      state.initialized = false;
      state.success = false;

      state.message = "";
      state.error = null;
    },

    // SET CART ITEMS

    setCartItems: (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];

      state.initialized = true;
    },
  },

  extraReducers: (builder) => {
    // GET CART

    builder
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.error = null;

        state.items = action.payload?.cart?.items || [];
      })

      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;

        state.error = action.payload || "Failed to fetch cart";
      });

    // ADD TO CART

    builder
      .addCase(addToCart.pending, (state) => {
        state.adding = true;
        state.error = null;
        state.success = false;
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        state.adding = false;

        state.success = true;
        state.error = null;

        state.message = action.payload?.message || "Product added to cart";

        state.items = action.payload?.cart?.items || [];
      })

      .addCase(addToCart.rejected, (state, action) => {
        state.adding = false;

        state.success = false;

        state.error = action.payload || "Failed to add product to cart";
      });

    // UPDATE CART ITEM

    builder
      .addCase(updateCartItem.pending, (state) => {
        state.updating = true;
        state.error = null;
        state.success = false;
      })

      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.updating = false;

        state.success = true;
        state.error = null;

        state.message = action.payload?.message || "Cart quantity updated";

        state.items = action.payload?.cart?.items || [];
      })

      .addCase(updateCartItem.rejected, (state, action) => {
        state.updating = false;

        state.success = false;

        state.error = action.payload || "Failed to update cart";
      });

    // REMOVE CART ITEM

    builder
      .addCase(removeCartItem.pending, (state) => {
        state.removing = true;
        state.error = null;
        state.success = false;
      })

      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.removing = false;

        state.success = true;
        state.error = null;

        state.message = action.payload?.message || "Cart item removed";

        state.items = action.payload?.cart?.items || [];
      })

      .addCase(removeCartItem.rejected, (state, action) => {
        state.removing = false;

        state.success = false;

        state.error = action.payload || "Failed to remove cart item";
      });

    // CLEAR CART

    builder
      .addCase(clearCart.pending, (state) => {
        state.clearing = true;
        state.error = null;
        state.success = false;
      })

      .addCase(clearCart.fulfilled, (state, action) => {
        state.clearing = false;

        state.success = true;
        state.error = null;

        state.message = action.payload?.message || "Cart cleared";

        state.items = [];
      })

      .addCase(clearCart.rejected, (state, action) => {
        state.clearing = false;

        state.success = false;

        state.error = action.payload || "Failed to clear cart";
      });

    // MERGE GUEST CART

    builder
      .addCase(mergeGuestCart.pending, (state) => {
        state.merging = true;
        state.error = null;
        state.success = false;
      })

      .addCase(mergeGuestCart.fulfilled, (state, action) => {
        state.merging = false;

        state.initialized = true;
        state.success = true;
        state.error = null;

        state.message = action.payload?.message || "Cart synced successfully";

        state.items = action.payload?.cart?.items || [];
      })

      .addCase(mergeGuestCart.rejected, (state, action) => {
        state.merging = false;

        state.success = false;

        state.error = action.payload || "Failed to sync guest cart";
      });
  },
});

export const {
  clearCartMessage,
  clearCartError,
  resetCartState,
  setCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;
