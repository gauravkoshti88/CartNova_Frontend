import { createAsyncThunk } from "@reduxjs/toolkit";

import wishlistService from "../../services/wishlistService.js";

import {
  addGuestWishlistItem,
  removeGuestWishlistItem,
  getGuestWishlist,
  clearGuestWishlist,
} from "../../utils/guestWishlist.js";

// ==========================================================
// GET WISHLIST
// ==========================================================

export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistService.getWishlist();

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch wishlist",
      );
    }
  },
);

// ==========================================================
// ADD WISHLIST
// ==========================================================

export const addWishlistItem = createAsyncThunk(
  "wishlist/addWishlistItem",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await wishlistService.addToWishlist(productId);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add product to wishlist",
      );
    }
  },
);

// ==========================================================
// REMOVE WISHLIST
// ==========================================================

export const removeWishlistItem = createAsyncThunk(
  "wishlist/removeWishlistItem",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await wishlistService.removeFromWishlist(productId);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to remove product from wishlist",
      );
    }
  },
);

// ==========================================================
// CLEAR WISHLIST
// ==========================================================

export const clearWishlist = createAsyncThunk(
  "wishlist/clearWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistService.clearWishlist();

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear wishlist",
      );
    }
  },
);

// ==========================================================
// MERGE GUEST WISHLIST
// ==========================================================

export const mergeGuestWishlist = createAsyncThunk(
  "wishlist/mergeGuestWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const guestWishlist = getGuestWishlist();

      // Nothing to merge
      if (!guestWishlist.length) {
        return {
          success: true,
          message: "No guest wishlist to merge",
          wishlist: {
            products: [],
          },
        };
      }

      const response = await wishlistService.mergeWishlist(guestWishlist);

      // Merge successful → remove guest wishlist
      if (response.data?.success) {
        clearGuestWishlist();
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to merge wishlist",
      );
    }
  },
);
