import { useEffect, useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { motion } from "framer-motion";
import useOrder from "../../hooks/useOrder";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function OrderSuccess() {
  useDocumentTitle("Order Placed");

  const { orderId } = useParams();
  const location = useLocation();

  const stateOrder = location.state?.order;

  const {
    currentOrder,
    detailsLoading,
    error,
    getOrderById,
    clearCurrentOrder,
  } = useOrder();

  const order = stateOrder || currentOrder;

  useEffect(() => {
    if (stateOrder) {
      return;
    }

    if (!orderId) {
      return;
    }

    getOrderById(orderId);

    return () => {
      clearCurrentOrder();
    };
  }, [orderId, stateOrder, getOrderById, clearCurrentOrder]);

  const finalOrder = useMemo(() => {
    return currentOrder || stateOrder || null;
  }, [currentOrder, stateOrder]);

  if (!finalOrder && detailsLoading) {
    return <OrderSuccessSkeleton />;
  }

  if (!finalOrder) {
    return (
      <main className="min-h-[70vh] bg-gray-50 py-16 dark:bg-gray-950">
        <div className="mx-auto max-w-xl px-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
            <Package size={30} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900 dark:text-white">
            Order not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
            {error ||
              "We couldn't load your order details. Please check your orders page."}
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/user/my-orders"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              View My Orders
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/shop"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-indigo-600 dark:hover:text-indigo-400"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const {
    _id,
    orderNumber,
    items = [],
    shippingAddress,
    subtotal = 0,
    discount = 0,
    shippingCharge = 0,
    tax = 0,
    totalAmount = 0,
    paymentMethod = "cod",
    paymentStatus = "pending",
    orderStatus = "pending",
    createdAt,
  } = finalOrder;

  return (
    <main className="min-h-screen bg-gray-50 py-8 dark:bg-gray-950 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 14,
            }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-950"
          >
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.25,
                duration: 0.8,
                ease: "easeOut",
              }}
            >
              <CheckCircle2
                size={46}
                className="text-green-600 dark:text-green-400"
              />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.35,
              duration: 0.5,
              ease: "easeOut",
            }}
            className="mt-5 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl"
          >
            Order Placed Successfully!
          </motion.h1>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            Thank you for shopping with G-Shop. Your order has been received and
            is being processed.
          </p>

          {orderNumber && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Order
              </span>

              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                #{orderNumber}
              </span>
            </div>
          )}

          {createdAt && (
            <p className="mt-3 text-xs text-gray-400">
              Placed on {formatDate(createdAt)}
            </p>
          )}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_350px]">
          {/* ==================================================
              LEFT
          ================================================== */}

          <div className="space-y-6">
            {/* ORDER STATUS */}

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                    <Truck size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      Order Status
                    </h2>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Current status of your order
                    </p>
                  </div>
                </div>

                <StatusBadge status={orderStatus} />
              </div>
            </section>

            {/* ORDER ITEMS */}

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  <ShoppingBag size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Order Items
                  </h2>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {items.map((item, index) => (
                  <OrderItem
                    key={item._id || `${item.productName}-${index}`}
                    item={item}
                  />
                ))}
              </div>
            </section>

            {/* SHIPPING ADDRESS */}

            {shippingAddress && (
              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      Delivery Address
                    </h2>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Your order will be delivered here
                    </p>
                  </div>
                </div>

                <ShippingAddress address={shippingAddress} />
              </section>
            )}
          </div>

          {/* ==================================================
              RIGHT
          ================================================== */}

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Payment Summary
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <SummaryRow label="Subtotal" value={subtotal} />

                <SummaryRow
                  label="Discount"
                  value={discount}
                  green={Number(discount) > 0}
                  negative={Number(discount) > 0}
                />

                <SummaryRow
                  label="Shipping"
                  value={shippingCharge}
                  free={Number(shippingCharge) === 0}
                />

                <SummaryRow label="Tax" value={tax} />
              </div>

              <div className="my-5 border-t border-dashed border-gray-200 dark:border-gray-700" />

              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 dark:text-white">
                  Total Amount
                </span>

                <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  ₹{formatMoney(totalAmount)}
                </span>
              </div>

              {/* PAYMENT */}

              <div className="mt-5 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
                <div className="flex items-center gap-3">
                  <CreditCard
                    size={19}
                    className="text-indigo-600 dark:text-indigo-400"
                  />

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Payment Method
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-white">
                      {formatPaymentMethod(paymentMethod)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Payment Status
                    </span>

                    <PaymentStatus status={paymentStatus} />
                  </div>
                </div>
              </div>

              {/* ACTIONS */}

              <div className="mt-6 space-y-3">
                <Link
                  to={`/user/orders/${_id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  View Order Details
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/user/my-orders"
                  className="flex w-full items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-indigo-600 dark:hover:text-indigo-400"
                >
                  View My Orders
                </Link>

                <Link
                  to="/shop"
                  className="flex w-full items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-indigo-600 dark:hover:text-indigo-400"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   ORDER ITEM
========================================================= */

function OrderItem({ item }) {
  const quantity = Number(item?.quantity) || 0;
  const price = Number(item?.price) || 0;

  const total = Number(item?.total) || price * quantity;

  const productName =
    item?.productName || item?.product?.basicInfo?.productName || "Product";

  const productMedia = item?.product?.media || [];

  const productImage =
    productMedia.find((media) => media?.isPrimary)?.url ||
    productMedia[0]?.url ||
    "";

  const image =
    item?.image?.url || item?.variant?.image?.url || productImage || "";

  const attributes =
    item?.attributes && typeof item.attributes === "object"
      ? item.attributes
      : {};

  return (
    <div className="flex gap-4 py-4 first:pt-0 last:pb-0">
      {/* IMAGE */}

      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 sm:h-24 sm:w-24">
        {image ? (
          <img
            src={image}
            alt={productName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            <Package size={26} />
          </div>
        )}
      </div>

      {/* INFO */}

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
          {productName}
        </h3>

        {item?.sku && (
          <p className="mt-1 text-xs text-gray-400">SKU: {item.sku}</p>
        )}

        {Object.keys(attributes).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(attributes).map(([key, value]) => (
              <span
                key={key}
                className="rounded-md bg-gray-100 px-2 py-1 text-[11px] text-gray-600 dark:bg-gray-800 dark:text-gray-400"
              >
                {key}: {formatAttributeValue(value)}
              </span>
            ))}
          </div>
        )}

        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Qty: {quantity}
        </p>
      </div>

      {/* PRICE */}

      <div className="shrink-0 text-right">
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          ₹{formatMoney(total)}
        </p>

        {quantity > 1 && (
          <p className="mt-1 text-xs text-gray-400">
            ₹{formatMoney(price)} each
          </p>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   SHIPPING ADDRESS
========================================================= */

function ShippingAddress({ address }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-gray-900 dark:text-white">
          {address?.name || "Customer"}
        </p>

        {address?.addressType && (
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium capitalize text-gray-600 shadow-sm dark:bg-gray-900 dark:text-gray-400">
            {address.addressType}
          </span>
        )}
      </div>

      <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
        {address?.addressLine1}
        {address?.addressLine2 && <>, {address.addressLine2}</>}
        <br />
        {address?.city}, {address?.state} - {address?.pincode}
        {address?.landmark && (
          <>
            <br />
            Landmark: {address.landmark}
          </>
        )}
      </p>

      {address?.phone && (
        <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          Phone: <span className="font-normal">{address.phone}</span>
        </p>
      )}
    </div>
  );
}

/* =========================================================
   SUMMARY ROW
========================================================= */

function SummaryRow({
  label,
  value,
  green = false,
  negative = false,
  free = false,
}) {
  const amount = Number(value || 0);

  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>

      {free ? (
        <span className="font-semibold text-green-600 dark:text-green-400">
          FREE
        </span>
      ) : (
        <span
          className={`font-semibold ${
            green
              ? "text-green-600 dark:text-green-400"
              : "text-gray-900 dark:text-gray-200"
          }`}
        >
          {negative && amount > 0 ? "-₹" : "₹"}

          {formatMoney(Math.abs(amount))}
        </span>
      )}
    </div>
  );
}

/* =========================================================
   ORDER STATUS
========================================================= */

function StatusBadge({ status }) {
  const config = {
    pending: {
      label: "Pending",
      className:
        "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
    },

    confirmed: {
      label: "Confirmed",
      className: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    },

    processing: {
      label: "Processing",
      className:
        "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400",
    },

    shipped: {
      label: "Shipped",
      className:
        "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
    },

    out_for_delivery: {
      label: "Out for Delivery",
      className:
        "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
    },

    delivered: {
      label: "Delivered",
      className:
        "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
    },

    cancelled: {
      label: "Cancelled",
      className: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
    },

    returned: {
      label: "Returned",
      className:
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    },
  };

  const current = config[status] || config.pending;

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${current.className}`}
    >
      {current.label}
    </span>
  );
}

/* =========================================================
   PAYMENT STATUS
========================================================= */

function PaymentStatus({ status }) {
  const config = {
    pending:
      "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",

    paid: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",

    failed: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",

    refunded: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",

    partially_refunded:
      "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
        config[status] || config.pending
      }`}
    >
      {formatStatus(status || "pending")}
    </span>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function OrderSuccessSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl animate-pulse px-4 sm:px-6 lg:px-8">
        <div className="mx-auto h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-800" />

        <div className="mx-auto mt-5 h-8 w-72 rounded bg-gray-200 dark:bg-gray-800" />

        <div className="mx-auto mt-3 h-4 w-96 max-w-full rounded bg-gray-200 dark:bg-gray-800" />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_350px]">
          <div className="space-y-6">
            <div className="h-24 rounded-2xl bg-gray-200 dark:bg-gray-800" />

            <div className="h-80 rounded-2xl bg-gray-200 dark:bg-gray-800" />

            <div className="h-56 rounded-2xl bg-gray-200 dark:bg-gray-800" />
          </div>

          <div className="h-[520px] rounded-2xl bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function formatMoney(value) {
  return Number(value || 0).toLocaleString("en-IN");
}

function formatDate(value) {
  try {
    return new Date(value).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "";
  }
}

function formatStatus(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatPaymentMethod(method) {
  if (method === "cod") {
    return "Cash on Delivery";
  }

  if (method === "online") {
    return "Online Payment";
  }

  return formatStatus(method || "Unknown");
}

function formatAttributeValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "object") {
    return value?.label || value?.value || value?.name || "";
  }

  return String(value);
}
