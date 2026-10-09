import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeGuestCart,
} from "../redux/thunks/cartThunk";

export default function useCart() {
  const dispatch = useDispatch();

  const {
    items = [],

    // Loading states
    loading = false,
    adding = false,
    updating = false,
    removing = false,
    clearing = false,
    merging = false,

    // Request state
    initialized = false,
    success = false,

    // Messages
    message = "",
    error = null,
  } = useSelector((state) => state.cart);

  // ==========================================================
  // GET CART
  // ==========================================================

  const fetchCart = useCallback(() => {
    return dispatch(getCart()).unwrap();
  }, [dispatch]);

  // ==========================================================
  // ADD ITEM
  // ==========================================================

  const addItem = useCallback(
    ({ productId, variantId, quantity = 1 }) => {
      return dispatch(
        addToCart({
          productId,
          variantId,
          quantity,
        }),
      ).unwrap();
    },
    [dispatch],
  );

  // ==========================================================
  // UPDATE ITEM
  // ==========================================================

  const updateItem = useCallback(
    ({ itemId, quantity }) => {
      return dispatch(
        updateCartItem({
          itemId,
          quantity,
        }),
      ).unwrap();
    },
    [dispatch],
  );

  // ==========================================================
  // REMOVE ITEM
  // ==========================================================

  const removeItem = useCallback(
    (itemId) => {
      return dispatch(removeCartItem(itemId)).unwrap();
    },
    [dispatch],
  );

  // ==========================================================
  // CLEAR CART
  // ==========================================================

  const emptyCart = useCallback(() => {
    return dispatch(clearCart()).unwrap();
  }, [dispatch]);

  // ==========================================================
  // MERGE GUEST CART
  // ==========================================================

  const mergeCart = useCallback(
    (guestItems) => {
      return dispatch(mergeGuestCart(guestItems)).unwrap();
    },
    [dispatch],
  );

  // ==========================================================
  // CART HELPERS
  // ==========================================================

  const totalItems = items.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0,
  );

  // ==========================================================
  // GET ITEM
  // ==========================================================

  const getItem = useCallback(
    (itemId) => {
      return (
        items.find((item) => String(item._id || item.id) === String(itemId)) ||
        null
      );
    },
    [items],
  );

  // ==========================================================
  // CHECK ITEM
  // ==========================================================

  const isItemInCart = useCallback(
    (productId, variantId) => {
      return items.some(
        (item) =>
          String(item.productId?._id || item.productId) === String(productId) &&
          String(item.variantId?._id || item.variantId) === String(variantId),
      );
    },
    [items],
  );

  // ==========================================================
  // RETURN
  // ==========================================================

  return {
    // Data
    items,
    totalItems,

    // Request state
    initialized,
    success,

    // Loading states
    loading,
    adding,
    updating,
    removing,
    clearing,
    merging,

    // Messages
    message,
    error,

    // Actions
    fetchCart,
    addItem,
    updateItem,
    removeItem,
    emptyCart,
    mergeCart,

    // Helpers
    getItem,
    isItemInCart,
  };
}
