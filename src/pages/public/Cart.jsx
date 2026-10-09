import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Tag,
  Truck,
} from "lucide-react";

import useCart from "../../hooks/useCart";
import useGuestCart from "../../hooks/useGuestCart";
import { useSelector } from "react-redux";
import { Heading } from "../../components/Heading";
import Breadcrumb from "../../components/Breadcrumb";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const Cart = () => {
  useDocumentTitle("Shopping Cart");
  const { isAuthenticated } = useSelector((state) => state.userAuth);

  const cart = useCart();
  const guestCart = useGuestCart();

  // ============================================================
  // GET AUTHENTICATED CART
  // ============================================================

  useEffect(() => {
    if (isAuthenticated) {
      if (!cart.initialized) {
        cart.fetchCart();
      }
    } else {
      guestCart.refreshGuestCart();
    }
  }, [
    isAuthenticated,
    cart.initialized,
    cart.fetchCart,
    guestCart.refreshGuestCart,
  ]);

  // ============================================================
  // CART SOURCE
  // ============================================================

  const loading = isAuthenticated ? cart.loading : guestCart.loading;

  const items = isAuthenticated ? cart.items : guestCart.items;

  const totalItems = isAuthenticated ? cart.totalItems : guestCart.totalItems;

  // ============================================================
  // ACTIONS
  // ============================================================

  const updateItem = isAuthenticated
    ? cart.updateItem
    : guestCart.updateGuestItem;

  const removeItem = isAuthenticated
    ? cart.removeItem
    : guestCart.removeGuestItem;

  // ============================================================
  // SUBTOTAL
  // ============================================================

  const subtotal = items.reduce((total, item) => {
    const product = item.product;

    const variant =
      item.variant ||
      product?.variants?.find(
        (variant) =>
          String(variant._id || variant.id) === String(item.variantId),
      );

    const price = Number(variant?.salePrice ?? item.salePrice ?? 0);

    const quantity = Number(item.quantity || 0);

    return total + price * quantity;
  }, 0);

  // ============================================================
  // SHIPPING
  // ============================================================

  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 79;

  const total = subtotal + shipping;

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Loading cart...
        </div>
      </div>
    );
  }

  // ============================================================
  // EMPTY CART
  // ============================================================

  if (!items.length) {
    return (
      <div className="mx-auto flex min-h-[65vh] max-w-7xl items-center justify-center px-4">
        <div className="text-center">
          <div
            className="
              mx-auto
              mb-5
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-gray-100
              dark:bg-slate-800
            "
          >
            <ShoppingBag size={34} className="text-gray-400" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your Cart is Empty
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Looks like you haven't added anything to your cart yet.
          </p>

          <Link
            to="/shop"
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-gray-900
              px-6
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-gray-800
              dark:bg-white
              dark:text-gray-900
            "
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ============================================================
  // CART
  // ============================================================

  return (
    <div className="mx-auto max-w-7xl px-4 py-1 md:py-5 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-950">
      <Breadcrumb />
      {/* HEADER */}

      <div className="flex justify-center my-5">
        <Heading
          heading={"Shopping Cart"}
          para={`${totalItems} ${totalItems === 1 ? "item" : "items"} in your cart`}
        />
      </div>

      {/* CONTENT */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        {/* CART ITEMS */}

        <div className="space-y-4">
          {items.map((item) => (
            <CartItem
              key={
                item.key || item._id || `${item.productId}-${item.variantId}`
              }
              item={item}
              isAuthenticated={isAuthenticated}
              updateItem={updateItem}
              removeItem={removeItem}
            />
          ))}
        </div>

        {/* SUMMARY */}

        <CartSummary subtotal={subtotal} shipping={shipping} total={total} />
      </div>
    </div>
  );
};

export default Cart;

/* ============================================================
   CART ITEM
============================================================ */

function CartItem({ item, isAuthenticated, updateItem, removeItem }) {
  const product = item.product;

  // ============================================================
  // VARIANT
  // ============================================================

  const variant =
    item.variant ||
    product?.variants?.find(
      (variant) => String(variant._id || variant.id) === String(item.variantId),
    );

  // ============================================================
  // PRODUCT INFO
  // ============================================================

  const productName =
    product?.basicInfo?.productName || item.productName || "Product";

  // ============================================================
  // IMAGE
  // ============================================================

  const image =
    variant?.image?.url ||
    product?.media?.find((image) => image.isPrimary)?.url ||
    product?.media?.[0]?.url ||
    "";

  // ============================================================
  // PRICE
  // ============================================================

  const salePrice = Number(variant?.salePrice ?? item.salePrice ?? 0);

  const mrp = Number(variant?.mrp ?? item.mrp ?? salePrice);

  // ============================================================
  // STOCK
  // ============================================================

  const stock = Number(variant?.stock ?? 0);

  const quantity = Number(item.quantity || 1);

  // Stock available hai tabhi limit lagao
  const maxOrderQty = Number(item?.product?.inventory?.maxOrderQty ?? 0);

  const maxQuantity =
    stock > 0 && maxOrderQty > 0
      ? Math.min(stock, maxOrderQty)
      : stock > 0
        ? stock
        : maxOrderQty > 0
          ? maxOrderQty
          : Infinity;
  // ============================================================
  // DISCOUNT
  // ============================================================

  const discount =
    mrp > salePrice && salePrice > 0
      ? Math.round(((mrp - salePrice) / mrp) * 100)
      : 0;

  // ============================================================
  // ATTRIBUTES
  // ============================================================

  const attributes = variant?.attributes
    ? Object.entries(variant.attributes)
    : [];

  // ============================================================
  // UPDATE QUANTITY
  // ============================================================

  const handleQuantity = async (newQuantity) => {
    if (newQuantity < 1) return;

    // Product stock limit
    if (newQuantity > maxQuantity) {
      return;
    }

    try {
      if (isAuthenticated) {
        const itemId = item._id || item.itemId;

        if (!itemId) {
          console.error("Authenticated cart item ID missing");
          return;
        }

        await updateItem({
          itemId,
          quantity: newQuantity,
        });
      } else {
        if (!item.productId || !item.variantId) {
          console.error("Guest cart IDs missing", item);
          return;
        }

        await updateItem({
          productId: item.productId,
          variantId: item.variantId,
          quantity: newQuantity,
        });
      }
    } catch (error) {
      console.error("Failed to update cart item:", error);
    }
  };

  // ============================================================
  // REMOVE
  // ============================================================

  const handleRemove = async () => {
    try {
      if (isAuthenticated) {
        const itemId = item._id || item.itemId;

        if (!itemId) {
          return;
        }

        await removeItem(itemId);
      } else {
        await removeItem({
          productId: item.productId,
          variantId: item.variantId,
        });
      }
    } catch (error) {
      console.error("Failed to remove cart item:", error);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-4
        shadow-sm
        dark:border-slate-700
        dark:bg-slate-800
      "
    >
      <div className="flex gap-4">
        {/* IMAGE */}

        <Link
          to={`/product/category/${product?.basicInfo?.category?.slug}/${product?.slug || ""}`}
          className="
            flex
            h-20
            w-20
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-xl
            bg-gray-100
            sm:h-28
            sm:w-28
            dark:bg-slate-700
          "
        >
          {image ? (
            <img
              src={image}
              alt={productName}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <ShoppingBag size={28} className="text-gray-400" />
          )}
        </Link>

        {/* INFO */}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                to={`/product/${product?.slug || ""}`}
                className="
                  line-clamp-2
                  text-sm
                  font-semibold
                  text-gray-900
                  hover:text-gray-600
                  sm:text-base
                  dark:text-white
                "
              >
                {productName}
              </Link>

              {/* ATTRIBUTES */}

              {attributes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {attributes.map(([name, value]) => (
                    <span
                      key={name}
                      className="
                          rounded-md
                          bg-gray-100
                          px-2
                          py-1
                          text-[11px]
                          text-gray-600
                          dark:bg-slate-700
                          dark:text-gray-300
                        "
                    >
                      {name}: {value?.label || value?.value || value}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* REMOVE */}

            <button
              type="button"
              onClick={handleRemove}
              className="
                shrink-0
                rounded-lg
                p-2
                text-gray-400
                transition
                hover:bg-red-50
                hover:text-red-500
                dark:hover:bg-red-950/30
              "
              aria-label="Remove item"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* PRICE */}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-base font-bold text-gray-900 dark:text-white">
              ₹{salePrice.toLocaleString("en-IN")}
            </span>

            {mrp > salePrice && (
              <>
                <span className="text-xs text-gray-400 line-through">
                  ₹{mrp.toLocaleString("en-IN")}
                </span>

                {discount > 0 && (
                  <span className="text-xs font-semibold text-green-600">
                    {discount}% OFF
                  </span>
                )}
              </>
            )}
          </div>

          {/* BOTTOM */}

          <div className="mt-4 flex items-center justify-between gap-3">
            {/* QUANTITY */}

            <div
              className="
                flex
                items-center
                rounded-lg
                border
                border-gray-200
                dark:border-slate-600
              "
            >
              <button
                type="button"
                disabled={quantity <= 1}
                onClick={() => handleQuantity(quantity - 1)}
                className="
                  p-2
                  text-gray-500
                  transition
                  hover:text-gray-900
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  dark:text-gray-300
                  dark:hover:text-white
                "
              >
                <Minus size={15} />
              </button>

              <span
                className="
                  min-w-8
                  text-center
                  text-sm
                  font-semibold
                  text-gray-900
                  dark:text-white
                "
              >
                {quantity}
              </span>

              <button
                type="button"
                disabled={
                  (stock > 0 && quantity >= stock) ||
                  (maxQuantity > 0 && quantity > maxQuantity)
                }
                onClick={() => handleQuantity(quantity + 1)}
                className="
                  p-2
                  text-gray-500
                  transition
                  hover:text-gray-900
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  dark:text-gray-300
                  dark:hover:text-white
                "
              >
                <Plus size={15} />
              </button>
            </div>

            {maxQuantity > 0 && quantity === maxQuantity && (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Maximum {maxQuantity} item{maxQuantity > 1 ? "s" : ""} per order
              </p>
            )}

            {/* STOCK */}

            <div className="text-right">
              {stock > 0 ? (
                <span className="text-xs font-medium text-green-600">
                  In Stock
                </span>
              ) : (
                <span className="text-xs font-medium text-red-500">
                  Out of Stock
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SUMMARY
============================================================ */

function CartSummary({ subtotal, shipping, total }) {
  return (
    <div
      className="
        h-fit
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-5
        shadow-sm
        lg:sticky
        lg:top-24
        dark:border-slate-700
        dark:bg-slate-800
      "
    >
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        Order Summary
      </h2>

      {/* FREE SHIPPING */}

      <div
        className="
          mt-4
          flex
          items-center
          gap-3
          rounded-xl
          bg-green-50
          p-3
          dark:bg-green-950/20
        "
      >
        <Truck size={19} className="shrink-0 text-green-600" />

        <p className="text-xs font-medium text-green-700 dark:text-green-400">
          {shipping === 0
            ? "You got free shipping!"
            : "Free shipping on orders above ₹999"}
        </p>
      </div>

      {/* PRICE */}

      <div
        className="
          mt-5
          space-y-3
          border-b
          border-gray-200
          pb-5
          dark:border-slate-700
        "
      >
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Subtotal</span>

          <span className="font-medium text-gray-900 dark:text-white">
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Shipping</span>

          <span className="font-medium text-gray-900 dark:text-white">
            {shipping === 0 ? "FREE" : `₹${shipping.toLocaleString("en-IN")}`}
          </span>
        </div>
      </div>

      {/* TOTAL */}

      <div className="flex justify-between py-5">
        <span className="text-base font-bold text-gray-900 dark:text-white">
          Total
        </span>

        <span className="text-xl font-bold text-gray-900 dark:text-white">
          ₹{total.toLocaleString("en-IN")}
        </span>
      </div>

      {/* COUPON */}

      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Tag
            size={16}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="text"
            placeholder="Coupon code"
            className="
              h-11
              w-full
              rounded-xl
              border
              border-gray-200
              bg-transparent
              pl-9
              pr-3
              text-sm
              outline-none
              focus:border-gray-400
              dark:border-slate-600
              dark:text-white
            "
          />
        </div>

        <button
          type="button"
          className="
            rounded-xl
            border
            border-gray-200
            px-4
            text-sm
            font-semibold
            text-gray-700
            transition
            hover:bg-gray-50
            dark:border-slate-600
            dark:text-gray-200
            dark:hover:bg-slate-700
          "
        >
          Apply
        </button>
      </div>

      {/* CHECKOUT */}

      <Link
        to="/user/checkout"
        className="block w-full rounded-xl bg-gray-900 px-5 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
      >
        Proceed to Checkout
      </Link>

      <p className="mt-3 text-center text-[11px] text-gray-400">
        Taxes and final shipping charges will be calculated at checkout.
      </p>
    </div>
  );
}
