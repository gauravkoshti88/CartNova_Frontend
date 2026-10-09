import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getWishlist,
  addWishlistItem,
  removeWishlistItem,
  clearWishlist,
  mergeGuestWishlist,
} from "../redux/thunks/wishlistThunk";

import {
  addGuestWishlistItem,
  removeGuestWishlistItem,
  getGuestWishlist,
  isGuestWishlistItem,
  clearGuestWishlist,
} from "../utils/guestWishlist";

export default function useWishlist() {
  const dispatch = useDispatch();

  const {
    products = [],
    loading = false,
    error = null,
    message = null,
    success = false,
    initialized = false,
  } = useSelector((state) => state.wishlist || {});

  const { isAuthenticated } = useSelector((state) => state.userAuth);

  // ========================================================
  // GUEST WISHLIST STATE
  // ========================================================

  const [guestWishlist, setGuestWishlist] = useState(() => getGuestWishlist());

  // ========================================================
  // SYNC GUEST WISHLIST
  // ========================================================

  const refreshGuestWishlist = useCallback(() => {
    setGuestWishlist(getGuestWishlist());
  }, []);

  // ========================================================
  // FETCH AUTHENTICATED WISHLIST
  // ========================================================

  const fetchWishlist = useCallback(() => {
    if (!isAuthenticated) {
      refreshGuestWishlist();
      return;
    }

    return dispatch(getWishlist()).unwrap();
  }, [dispatch, isAuthenticated, refreshGuestWishlist]);

  // ========================================================
  // LOAD WISHLIST WHEN AUTH CHANGES
  // ========================================================

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getWishlist());
    } else {
      refreshGuestWishlist();
    }
  }, [dispatch, isAuthenticated, refreshGuestWishlist]);

  // ========================================================
  // CHECK WISHLIST
  // ========================================================

  const isInWishlist = useCallback(
    (productId) => {
      if (!productId) {
        return false;
      }

      const id = productId.toString();

      // Guest
      if (!isAuthenticated) {
        return guestWishlist.some((wishlistId) => wishlistId.toString() === id);
      }

      // Authenticated
      return products.some((product) => {
        const productWishlistId =
          typeof product === "string" ? product : product?._id;

        return productWishlistId?.toString() === id;
      });
    },
    [isAuthenticated, guestWishlist, products],
  );

  // ========================================================
  // ADD
  // ========================================================

  const addItem = useCallback(
    async (productId) => {
      if (!productId) {
        throw new Error("Product ID is required");
      }

      // Guest
      if (!isAuthenticated) {
        const result = addGuestWishlistItem(productId);

        if (!result.success) {
          throw new Error(result.message);
        }

        setGuestWishlist(result.wishlist);

        return result;
      }

      // Authenticated
      return dispatch(addWishlistItem(productId)).unwrap();
    },
    [dispatch, isAuthenticated],
  );

  // ========================================================
  // REMOVE
  // ========================================================

  const removeItem = useCallback(
    async (productId) => {
      if (!productId) {
        throw new Error("Product ID is required");
      }

      // Guest
      if (!isAuthenticated) {
        const result = removeGuestWishlistItem(productId);

        setGuestWishlist(result.wishlist);

        return result;
      }

      // Authenticated
      return dispatch(removeWishlistItem(productId)).unwrap();
    },
    [dispatch, isAuthenticated],
  );

  // ========================================================
  // TOGGLE
  // ========================================================

  const toggleWishlist = useCallback(
    async (productId) => {
      if (isInWishlist(productId)) {
        return removeItem(productId);
      }

      return addItem(productId);
    },
    [isInWishlist, removeItem, addItem],
  );

  // ========================================================
  // CLEAR
  // ========================================================

  const clear = useCallback(async () => {
    // Guest
    if (!isAuthenticated) {
      clearGuestWishlist();

      setGuestWishlist([]);

      return {
        success: true,
        message: "Wishlist cleared successfully",
      };
    }

    // Authenticated
    return dispatch(clearWishlist()).unwrap();
  }, [dispatch, isAuthenticated]);

  // ========================================================
  // MERGE
  // ========================================================

  const merge = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    const guestItems = getGuestWishlist();

    if (!guestItems.length) {
      return {
        success: true,
        message: "No guest wishlist to merge",
      };
    }

    const result = await dispatch(mergeGuestWishlist()).unwrap();

    // Backend merge successful
    // Remove guest wishlist from localStorage
    if (result?.success) {
      clearGuestWishlist();
      setGuestWishlist([]);
    }

    return result;
  }, [dispatch, isAuthenticated]);

  // ========================================================
  // COUNT
  // ========================================================

  const totalItems = isAuthenticated ? products.length : guestWishlist.length;

  // ========================================================
  // RETURN
  // ========================================================

  return {
    wishlist: products,

    products,

    guestWishlist,

    totalItems,

    loading,
    error,
    message,
    success,
    initialized,

    isInWishlist,

    addItem,
    removeItem,
    toggleWishlist,

    clear,

    fetchWishlist,
    merge,

    refreshGuestWishlist,
  };
}
