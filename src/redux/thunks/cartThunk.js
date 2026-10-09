import { createAsyncThunk } from "@reduxjs/toolkit";

import cartService from "../../services/cartService";

// ============================================================
// GET CART
// ============================================================

export const getCart = createAsyncThunk(
  "cart/getCart",

  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();

      if (!response?.success) {
        return rejectWithValue(response?.message || "Failed to fetch cart");
      }

      const items = response?.cart?.items || [];

      const productIds = [
        ...new Set(items.map((item) => item.productId).filter(Boolean)),
      ];

      const productResults = await Promise.all(
        productIds.map(async (productId) => {
          try {
            const productResponse =
              await cartService.getProductDetailsById(productId);

            return {
              productId,
              product:
                productResponse?.product ||
                productResponse?.data?.product ||
                null,
            };
          } catch (error) {
            return {
              productId,
              product: null,
            };
          }
        }),
      );

      const productMap = Object.fromEntries(
        productResults.map(({ productId, product }) => [productId, product]),
      );

      const enrichedItems = items.map((item) => ({
        ...item,
        product: item.product || productMap[item.productId] || null,
      }));

      return {
        ...response,
        cart: {
          ...response.cart,
          items: enrichedItems,
        },
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch cart",
      );
    }
  },
);

// ============================================================
// ADD TO CART
// ============================================================

export const addToCart = createAsyncThunk(
  "cart/addToCart",

  async ({ productId, variantId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const response = await cartService.addToCart({
        productId,
        variantId,
        quantity,
      });

      if (!response?.success) {
        return rejectWithValue(
          response?.message || "Failed to add product to cart",
        );
      }

      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to add product to cart",
      );
    }
  },
);

// ============================================================
// UPDATE CART ITEM
// ============================================================

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",

  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartService.updateCartItem({
        itemId,
        quantity,
      });

      if (!response?.success) {
        return rejectWithValue(
          response?.message || "Failed to update cart item",
        );
      }

      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update cart item",
      );
    }
  },
);

// ============================================================
// REMOVE CART ITEM
// ============================================================

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",

  async (itemId, { rejectWithValue }) => {
    try {
      const response = await cartService.removeCartItem(itemId);

      if (!response?.success) {
        return rejectWithValue(
          response?.message || "Failed to remove cart item",
        );
      }

      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to remove cart item",
      );
    }
  },
);

// ============================================================
// CLEAR CART
// ============================================================

export const clearCart = createAsyncThunk(
  "cart/clearCart",

  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.clearCart();

      if (!response?.success) {
        return rejectWithValue(response?.message || "Failed to clear cart");
      }

      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to clear cart",
      );
    }
  },
);

// ============================================================
// MERGE GUEST CART
// ============================================================

export const mergeGuestCart = createAsyncThunk(
  "cart/mergeGuestCart",
  async (items, { rejectWithValue }) => {
    try {
      const guestItems = Array.isArray(items) ? items : [];

      if (!guestItems.length) {
        return {
          success: true,
          message: "No guest cart items to merge",
        };
      }

      const response = await cartService.mergeGuestCart(guestItems);

      if (!response?.success) {
        return rejectWithValue(
          response?.message || "Failed to merge guest cart",
        );
      }

      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to merge guest cart",
      );
    }
  },
);
