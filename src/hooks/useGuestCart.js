import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getGuestCart,
  saveGuestCart,
  clearGuestCart as clearStoredGuestCart,
} from "../utils/guestCart";

import cartService from "../services/cartService";

export default function useGuestCart() {
  // ============================================================
  // STATE
  // ============================================================

  const [items, setItems] = useState(() => {
    return getGuestCart()?.items || [];
  });

  const [loading, setLoading] = useState(false);

  // ============================================================
  // ENRICH GUEST CART
  // ============================================================

  const enrichItems = useCallback(async (cartItems) => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return [];
    }

    const productIds = [
      ...new Set(cartItems.map((item) => item.productId).filter(Boolean)),
    ];

    const productResults = await Promise.all(
      productIds.map(async (productId) => {
        try {
          const response = await cartService.getProductDetailsById(productId);

          return {
            productId,
            product: response?.product || response?.data?.product || null,
          };
        } catch (error) {
          console.error(
            `Failed to fetch guest cart product ${productId}`,
            error,
          );

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

    return cartItems.map((item) => {
      const product = item.product || productMap[item.productId] || null;

      const variant =
        product?.variants?.find(
          (variant) =>
            String(variant._id || variant.id) === String(item.variantId),
        ) || null;

      return {
        ...item,
        product,
        variant,
      };
    });
  }, []);

  // ============================================================
  // LOAD / REFRESH GUEST CART
  // ============================================================

  const refreshGuestCart = useCallback(async () => {
    try {
      setLoading(true);

      const cart = getGuestCart();

      const guestItems = Array.isArray(cart?.items) ? cart.items : [];

      const enrichedItems = await enrichItems(guestItems);

      setItems(enrichedItems);

      return enrichedItems;
    } catch (error) {
      console.error("REFRESH GUEST CART ERROR:", error);

      setItems([]);

      return [];
    } finally {
      setLoading(false);
    }
  }, [enrichItems]);

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  //   useEffect(() => {
  //     refreshGuestCart();
  //   }, [refreshGuestCart]);

  useEffect(() => {
    const handleGuestCartUpdate = () => {
      refreshGuestCart();
    };

    window.addEventListener("guest-cart-updated", handleGuestCartUpdate);

    return () => {
      window.removeEventListener("guest-cart-updated", handleGuestCartUpdate);
    };
  }, [refreshGuestCart]);

  // ============================================================
  // SYNC CART
  // ============================================================

  const syncCart = useCallback(
    async (newItems) => {
      const normalizedItems = Array.isArray(newItems) ? newItems : [];

      const storageItems = normalizedItems.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: Number(item.quantity || 1),
      }));

      if (storageItems.length === 0) {
        clearStoredGuestCart();

        setItems([]);

        window.dispatchEvent(new Event("guest-cart-updated"));

        return [];
      }

      // Save clean cart
      saveGuestCart(storageItems);

      // Update current hook immediately
      const enrichedItems = await enrichItems(storageItems);

      setItems(enrichedItems);

      // Notify other useGuestCart instances
      window.dispatchEvent(new Event("guest-cart-updated"));

      return enrichedItems;
    },
    [enrichItems],
  );

  // ============================================================
  // ADD ITEM
  // ============================================================

  const addGuestItem = useCallback(
    async ({ productId, variantId, quantity = 1 }) => {
      if (!productId || !variantId) {
        return {
          success: false,
          message: "Product and variant are required",
        };
      }

      const requestedQuantity = Number(quantity);

      if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
        return {
          success: false,
          message: "Quantity must be at least 1",
        };
      }

      const currentItems = getGuestCart()?.items || [];

      const existingIndex = currentItems.findIndex(
        (item) =>
          String(item.productId) === String(productId) &&
          String(item.variantId) === String(variantId),
      );

      let updatedItems;

      if (existingIndex !== -1) {
        updatedItems = currentItems.map((item, index) => {
          if (index !== existingIndex) {
            return item;
          }

          return {
            ...item,
            quantity: Number(item.quantity || 0) + requestedQuantity,
          };
        });
      } else {
        updatedItems = [
          ...currentItems,
          {
            productId,
            variantId,
            quantity: requestedQuantity,
          },
        ];
      }

      const enrichedItems = await syncCart(updatedItems);

      return {
        success: true,
        message: "Product added to cart",
        items: enrichedItems,
      };
    },
    [syncCart],
  );

  // ============================================================
  // UPDATE ITEM
  // ============================================================

  const updateGuestItem = useCallback(
    async ({ productId, variantId, quantity }) => {
      const newQuantity = Number(quantity);

      if (!Number.isInteger(newQuantity) || newQuantity < 1) {
        return {
          success: false,
          message: "Quantity must be at least 1",
        };
      }

      const currentItems = getGuestCart()?.items || [];

      const itemIndex = currentItems.findIndex(
        (item) =>
          String(item.productId) === String(productId) &&
          String(item.variantId) === String(variantId),
      );

      if (itemIndex === -1) {
        return {
          success: false,
          message: "Cart item not found",
        };
      }

      const updatedItems = currentItems.map((item, index) => {
        if (index !== itemIndex) {
          return item;
        }

        return {
          ...item,
          quantity: newQuantity,
        };
      });

      const enrichedItems = await syncCart(updatedItems);

      return {
        success: true,
        message: "Cart quantity updated",
        items: enrichedItems,
      };
    },
    [syncCart],
  );

  // ============================================================
  // REMOVE ITEM
  // ============================================================

  const removeGuestItem = useCallback(
    async ({ productId, variantId }) => {
      const currentItems = getGuestCart()?.items || [];

      const updatedItems = currentItems.filter(
        (item) =>
          !(
            String(item.productId) === String(productId) &&
            String(item.variantId) === String(variantId)
          ),
      );

      const enrichedItems = await syncCart(updatedItems);

      return {
        success: true,
        message: "Cart item removed",
        items: enrichedItems,
      };
    },
    [syncCart],
  );

  // ============================================================
  // CLEAR CART
  // ============================================================

  const clearGuestCart = useCallback(() => {
    clearStoredGuestCart();

    setItems([]);

    window.dispatchEvent(new Event("guest-cart-updated"));

    return {
      success: true,
      message: "Guest cart cleared",
      items: [],
    };
  }, []);

  // ============================================================
  // CHECK ITEM
  // ============================================================

  const isGuestItemInCart = useCallback(
    (productId, variantId) => {
      return items.some(
        (item) =>
          String(item.productId) === String(productId) &&
          String(item.variantId) === String(variantId),
      );
    },
    [items],
  );

  // ============================================================
  // GET ITEM
  // ============================================================

  const getGuestItem = useCallback(
    (productId, variantId) => {
      return (
        items.find(
          (item) =>
            String(item.productId) === String(productId) &&
            String(item.variantId) === String(variantId),
        ) || null
      );
    },
    [items],
  );

  // ============================================================
  // TOTAL ITEMS
  // ============================================================

  const totalItems = useMemo(() => {
    return items.reduce((total, item) => total + Number(item.quantity || 0), 0);
  }, [items]);

  // ============================================================
  // RETURN
  // ============================================================

  return {
    // Data
    items,
    totalItems,

    // Loading
    loading,

    // Actions
    addGuestItem,
    updateGuestItem,
    removeGuestItem,
    clearGuestCart,
    refreshGuestCart,

    // Helpers
    isGuestItemInCart,
    getGuestItem,
  };
}
