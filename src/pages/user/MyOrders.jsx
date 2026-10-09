import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ChevronRight,
  CalendarDays,
  CreditCard,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

import useOrder from "../../hooks/useOrder";
import Breadcrumb from "../../components/Breadcrumb";
import { Heading } from "../../components/Heading";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function MyOrders() {
  useDocumentTitle("My-Orders");
  const { orders, loading, error, pagination, getMyOrders, clearOrderError } =
    useOrder();

  const {
    currentPage = 1,
    limit = 10,
    totalOrders = 0,
    totalPages = 0,
    hasNextPage = false,
    hasPreviousPage = false,
  } = pagination || {};

  useEffect(() => {
    getMyOrders({
      page: currentPage,
      limit,
    });
  }, [currentPage, limit]);

  // ==================================================
  // PAGE CHANGE
  // ==================================================

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || loading) {
      return;
    }

    getMyOrders({
      page,
      limit,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==================================================
  // RETRY
  // ==================================================

  const handleRetry = () => {
    clearOrderError();

    getMyOrders({
      page: currentPage,
      limit,
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 sm:py-5">
      <Breadcrumb />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-5">
        {/* ============================================
            HEADER
        ============================================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <Heading
            heading={"My Orders"}
            para={"Track and manage all your orders."}
          />

          {totalOrders > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <ShoppingBag size={17} />

              <span>
                {totalOrders} {totalOrders === 1 ? "order" : "orders"}
              </span>
            </div>
          )}
        </div>

        {/* ============================================
            ERROR
        ============================================= */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                  Unable to load orders
                </p>

                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={handleRetry}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                <RefreshCw size={14} />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* ============================================
            LOADING
        ============================================= */}

        {loading ? (
          <OrdersSkeleton />
        ) : orders?.length > 0 ? (
          <>
            {/* ========================================
                ORDER LIST
            ======================================== */}

            <div className="space-y-5">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>

            {/* ========================================
                PAGINATION
            ======================================== */}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                hasNextPage={hasNextPage}
                hasPreviousPage={hasPreviousPage}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <EmptyOrders />
        )}
      </div>
    </main>
  );
}

// ==================================================
// ORDER CARD
// ==================================================

function OrderCard({ order }) {
  const items = order.items || [];
  const firstItem = items[0];

  // ==========================================
  // PRODUCT IMAGE FALLBACK
  // ==========================================

  const variantImage = firstItem?.image?.url;

  const productMedia = firstItem?.product?.media || [];

  const primaryProductImage = productMedia.find(
    (media) => media.isPrimary && media.url,
  );

  const fallbackProductImage = productMedia.find((media) => media.url);

  const image =
    variantImage || primaryProductImage?.url || fallbackProductImage?.url || "";

  const imageAlt =
    firstItem?.image?.alt ||
    primaryProductImage?.alt ||
    firstItem?.productName ||
    "Product";

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      {/* ==========================================
          CARD HEADER
      =========================================== */}

      <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
              Order
            </p>

            <p className="mt-0.5 text-sm font-bold text-gray-900 dark:text-white">
              #{order.orderNumber}
            </p>
          </div>

          <div className="hidden h-7 w-px bg-gray-200 dark:bg-gray-800 sm:block" />

          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <CalendarDays size={14} />
            {formatDate(order.createdAt)}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <ShoppingBag size={14} />
            {items.length} {items.length === 1 ? "item" : "items"}
          </div>
        </div>

        <StatusBadge status={order.orderStatus} />
      </div>

      {/* ==========================================
          CARD BODY
      =========================================== */}

      <div className="p-5 sm:p-6">
        <div className="flex gap-4">
          {/* IMAGE */}
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 sm:h-24 sm:w-24">
            {image ? (
              <img
                src={image}
                alt={imageAlt}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                <Package size={28} />
              </div>
            )}
          </div>

          {/* PRODUCT INFO */}
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-bold text-gray-900 dark:text-white sm:text-base">
              {firstItem?.productName || "Product"}
            </h2>

            {items.length > 1 && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                + {items.length - 1} more{" "}
                {items.length - 1 === 1 ? "item" : "items"}
              </p>
            )}

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
              <span>
                Qty:{" "}
                <strong className="text-gray-700 dark:text-gray-300">
                  {firstItem?.quantity || 0}
                </strong>
              </span>

              <span>
                Payment:{" "}
                <strong className="capitalize text-gray-700 dark:text-gray-300">
                  {order.paymentMethod === "cod" ? "COD" : "Online"}
                </strong>
              </span>
            </div>
          </div>

          {/* AMOUNT */}
          <div className="hidden shrink-0 text-right sm:block">
            <p className="text-xs text-gray-400">Total</p>

            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
              ₹{formatMoney(order.totalAmount)}
            </p>

            <PaymentStatus status={order.paymentStatus} />
          </div>
        </div>

        {/* MOBILE AMOUNT */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800 sm:hidden">
          <div>
            <p className="text-xs text-gray-400">Total Amount</p>

            <p className="mt-1 text-base font-bold text-gray-900 dark:text-white">
              ₹{formatMoney(order.totalAmount)}
            </p>
          </div>

          <PaymentStatus status={order.paymentStatus} />
        </div>
      </div>

      {/* ==========================================
          CARD FOOTER
      =========================================== */}

      <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 px-5 py-4 dark:border-gray-800 dark:bg-gray-950 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <OrderDeliveryInfo order={order} />

        <Link
          to={`/user/orders/${order._id}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
        >
          Track Order
          <ChevronRight size={15} />
        </Link>
      </div>
    </article>
  );
}

// ==================================================
// DELIVERY INFO
// ==================================================

function OrderDeliveryInfo({ order }) {
  if (order.orderStatus === "delivered") {
    return (
      <div className="flex items-center gap-2 text-xs font-medium text-green-600 dark:text-green-400">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        Delivered
        {order.deliveredAt && <> on {formatDate(order.deliveredAt)}</>}
      </div>
    );
  }

  if (order.orderStatus === "cancelled") {
    return (
      <div className="flex items-center gap-2 text-xs font-medium text-red-600 dark:text-red-400">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        Order Cancelled
      </div>
    );
  }

  if (order.orderStatus === "shipped") {
    return (
      <div className="flex items-center gap-2 text-xs font-medium text-purple-600 dark:text-purple-400">
        <span className="h-2 w-2 rounded-full bg-purple-500" />
        Shipped
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
      <span className="h-2 w-2 rounded-full bg-gray-400" />

      {formatOrderStatus(order.orderStatus)}
    </div>
  );
}

// ==================================================
// STATUS BADGE
// ==================================================

function StatusBadge({ status }) {
  const config = {
    pending: [
      "Pending",
      "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
    ],

    confirmed: [
      "Confirmed",
      "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    ],

    processing: [
      "Processing",
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400",
    ],

    shipped: [
      "Shipped",
      "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
    ],

    out_for_delivery: [
      "Out for Delivery",
      "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
    ],

    delivered: [
      "Delivered",
      "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
    ],

    cancelled: [
      "Cancelled",
      "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
    ],

    returned: [
      "Returned",
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    ],
  };

  const [label, classes] = config[status] || config.pending;

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${classes}`}
    >
      {label}
    </span>
  );
}

// ==================================================
// PAYMENT STATUS
// ==================================================

function PaymentStatus({ status }) {
  const config = {
    pending: ["Payment Pending", "text-yellow-600 dark:text-yellow-400"],

    paid: ["Paid", "text-green-600 dark:text-green-400"],

    failed: ["Payment Failed", "text-red-600 dark:text-red-400"],

    refunded: ["Refunded", "text-purple-600 dark:text-purple-400"],

    partially_refunded: [
      "Partially Refunded",
      "text-orange-600 dark:text-orange-400",
    ],
  };

  const [label, classes] = config[status] || config.pending;

  return (
    <span className={`mt-1 block text-[10px] font-semibold ${classes}`}>
      {label}
    </span>
  );
}

// ==================================================
// PAGINATION
// ==================================================

function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}) {
  const pages = getPaginationPages(currentPage, totalPages);

  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex items-center justify-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <ArrowLeft size={15} />
        </button>

        {pages.map((page, index) =>
          page === "..." ? (
            <span
              key={`dots-${index}`}
              className="flex h-9 w-8 items-center justify-center text-sm text-gray-400"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`h-9 min-w-9 rounded-lg px-2 text-xs font-semibold transition ${
                currentPage === page
                  ? "bg-indigo-600 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

// ==================================================
// EMPTY STATE
// ==================================================

function EmptyOrders() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
        <ShoppingBag size={30} />
      </div>

      <h2 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
        No Orders Yet
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
        You haven't placed any orders yet. Start shopping and your orders will
        appear here.
      </p>

      <Link
        to="/shop"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        <ShoppingBag size={16} />
        Start Shopping
      </Link>
    </div>
  );
}

// ==================================================
// SKELETON
// ==================================================

function OrdersSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
            <div className="space-y-2">
              <div className="h-2.5 w-16 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-800" />
            </div>

            <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-800" />
          </div>

          <div className="flex gap-4 p-5 sm:p-6">
            <div className="h-24 w-24 shrink-0 rounded-xl bg-gray-200 dark:bg-gray-800" />

            <div className="flex-1 space-y-3">
              <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-3 w-1/4 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>

          <div className="flex justify-between border-t border-gray-100 bg-gray-50 px-5 py-4 dark:border-gray-800 dark:bg-gray-950">
            <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-9 w-28 rounded-xl bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ==================================================
// HELPERS
// ==================================================

function formatMoney(value) {
  return Number(value || 0).toLocaleString("en-IN");
}

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatOrderStatus(status) {
  if (!status) return "Order Processing";

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getPaginationPages(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}
