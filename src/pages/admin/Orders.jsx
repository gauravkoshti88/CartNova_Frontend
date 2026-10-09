import { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import useAdminOrder from "../../hooks/useAdminOrder.js";
import { Heading } from "../../components/Heading.jsx";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned",
];

const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "refunded",
  "partially_refunded",
];

const PAYMENT_METHODS = ["cod", "online"];

export default function AdminOrders() {
  useDocumentTitle("Orders | Admin");
  const navigate = useNavigate();

  const {
    orders,
    loading,
    error,
    pagination,
    getAdminOrders,
    clearAdminOrderError,
  } = useAdminOrder();

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
    paymentMethod: "",
  });

  const [page, setPage] = useState(1);

  const limit = 20;

  useEffect(() => {
    getAdminOrders({
      page,
      limit,
      search,
      ...filters,
    });
  }, [page, filters.status, filters.paymentStatus, filters.paymentMethod]);

  const handleSearch = (e) => {
    e.preventDefault();

    setPage(1);

    getAdminOrders({
      page: 1,
      limit,
      search,
      ...filters,
    });
  };

  const handleFilterChange = (name, value) => {
    setPage(1);

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleRefresh = () => {
    getAdminOrders({
      page,
      limit,
      search,
      ...filters,
    });
  };

  return (
    <div className="space-y-5 p-5">
      {/* ==========================================
          HEADER
      =========================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Heading heading={"Orders"} para={"Manage and track customer orders"} />
        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ==========================================
          FILTERS
      =========================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* SEARCH */}

          <form onSubmit={handleSearch} className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order number..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-indigo-950"
            />
          </form>

          {/* STATUS */}

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="">All Order Status</option>

            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {formatStatus(status)}
              </option>
            ))}
          </select>

          {/* PAYMENT STATUS */}

          <select
            value={filters.paymentStatus}
            onChange={(e) =>
              handleFilterChange("paymentStatus", e.target.value)
            }
            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="">All Payment Status</option>

            {PAYMENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {formatStatus(status)}
              </option>
            ))}
          </select>

          {/* PAYMENT METHOD */}

          <select
            value={filters.paymentMethod}
            onChange={(e) =>
              handleFilterChange("paymentMethod", e.target.value)
            }
            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="">All Payment Methods</option>

            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method === "cod" ? "Cash on Delivery" : "Online"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ==========================================
          ERROR
      =========================================== */}

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-400">
          <span>{error}</span>

          <button
            type="button"
            onClick={clearAdminOrderError}
            className="font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ==========================================
          TABLE
      =========================================== */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left dark:border-gray-800 dark:bg-gray-800/50">
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Order
                </th>

                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Customer
                </th>

                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Items
                </th>

                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Total
                </th>

                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Payment
                </th>

                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <LoadingRows />
              ) : orders.length ? (
                orders.map((order) => (
                  <OrderRow
                    key={order._id}
                    order={order}
                    onView={() => navigate(`/admin/orders/${order._id}`)}
                  />
                ))
              ) : (
                <EmptyState />
              )}
            </tbody>
          </table>
        </div>

        {/* ========================================
            PAGINATION
        ========================================= */}

        {!loading && orders.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Page{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {pagination.currentPage}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {pagination.totalPages}
              </span>
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={!pagination.hasPreviousPage || page <= 1}
                onClick={() => setPage((previous) => previous - 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"
              >
                <ChevronLeft size={15} />
                Previous
              </button>

              <button
                type="button"
                disabled={!pagination.hasNextPage}
                onClick={() => setPage((previous) => previous + 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================================================
// ORDER ROW
// ==================================================

function OrderRow({ order, onView }) {
  const customerName =
    order.shippingAddress?.name || order.user?.firstName || "Customer";

  const itemCount =
    order.items?.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0,
    ) || 0;

  return (
    <tr className="transition hover:bg-gray-50/70 dark:hover:bg-gray-800/30">
      <td className="px-5 py-4">
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          #{order.orderNumber}
        </p>

        <p className="mt-1 text-[11px] text-gray-400">
          {formatDate(order.createdAt)}
        </p>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {customerName}
        </p>

        <p className="mt-1 text-xs text-gray-400">
          {order.shippingAddress?.phone || order.user?.phone || ""}
        </p>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Package size={16} />
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </div>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
        </p>
      </td>

      <td className="px-5 py-4">
        <p className="text-xs font-semibold capitalize text-gray-700 dark:text-gray-300">
          {order.paymentMethod === "cod" ? "COD" : "Online"}
        </p>

        <p className="mt-1 text-[11px] capitalize text-gray-400">
          {order.paymentStatus}
        </p>
      </td>

      <td className="px-5 py-4">
        <OrderStatusBadge status={order.orderStatus} />
      </td>

      <td className="px-5 py-4 text-right">
        <button
          type="button"
          onClick={onView}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
        >
          <Eye size={15} />
          View
        </button>
      </td>
    </tr>
  );
}

// ==================================================
// STATUS BADGE
// ==================================================

function OrderStatusBadge({ status }) {
  const config = {
    pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400",

    confirmed:
      "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",

    processing:
      "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",

    shipped:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400",

    out_for_delivery:
      "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",

    delivered:
      "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",

    cancelled: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",

    returned: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${config[status] || config.pending}`}
    >
      {formatStatus(status)}
    </span>
  );
}

// ==================================================
// LOADING
// ==================================================

function LoadingRows() {
  return Array.from({
    length: 6,
  }).map((_, index) => (
    <tr key={index} className="animate-pulse">
      {Array.from({
        length: 7,
      }).map((__, cell) => (
        <td key={cell} className="px-5 py-5">
          <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800" />
        </td>
      ))}
    </tr>
  ));
}

// ==================================================
// EMPTY
// ==================================================

function EmptyState() {
  return (
    <tr>
      <td colSpan={7} className="px-5 py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800">
          <Package size={22} />
        </div>

        <p className="mt-4 text-sm font-bold text-gray-700 dark:text-gray-300">
          No orders found
        </p>

        <p className="mt-1 text-xs text-gray-400">
          Try changing your search or filters.
        </p>
      </td>
    </tr>
  );
}

// ==================================================
// HELPERS
// ==================================================

function formatStatus(status = "") {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
