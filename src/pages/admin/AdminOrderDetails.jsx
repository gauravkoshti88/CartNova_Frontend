import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  CreditCard,
  Truck,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  Clock3,
  XCircle,
  RotateCcw,
  User,
} from "lucide-react";

import useAdminOrder from "../../hooks/useAdminOrder.js";

// ==================================================
// CONSTANTS
// ==================================================

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

// ==================================================
// COMPONENT
// ==================================================

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const {
    currentOrder,
    detailsLoading,
    updateLoading,
    trackingLoading,
    error,
    success,

    getAdminOrderById,
    updateAdminOrderStatus,
    updateOrderTracking,

    clearAdminOrderError,
    clearAdminOrderSuccess,
  } = useAdminOrder();

  const [selectedStatus, setSelectedStatus] = useState("");

  const [trackingForm, setTrackingForm] = useState({
    courierName: "",
    trackingNumber: "",
    trackingUrl: "",
  });

  // ==================================================
  // LOAD ORDER
  // ==================================================

  useEffect(() => {
    if (orderId) {
      getAdminOrderById(orderId);
    }
  }, [orderId]);

  // ==================================================
  // SYNC ORDER DATA
  // ==================================================

  useEffect(() => {
    if (!currentOrder) return;

    setSelectedStatus(currentOrder.orderStatus || "pending");

    setTrackingForm({
      courierName: currentOrder.tracking?.courierName || "",

      trackingNumber: currentOrder.tracking?.trackingNumber || "",

      trackingUrl: currentOrder.tracking?.trackingUrl || "",
    });
  }, [currentOrder]);

  // ==================================================
  // CLEAR SUCCESS
  // ==================================================

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      clearAdminOrderSuccess();
    }, 3000);

    return () => clearTimeout(timer);
  }, [success]);

  // ==================================================
  // UPDATE STATUS
  // ==================================================

  const handleStatusUpdate = async () => {
    if (!currentOrder) return;

    if (selectedStatus === currentOrder.orderStatus) {
      return;
    }

    try {
      await updateAdminOrderStatus(currentOrder._id, selectedStatus);
    } catch {
      // Redux handles error
    }
  };

  // ==================================================
  // TRACKING INPUT
  // ==================================================

  const handleTrackingChange = (field, value) => {
    setTrackingForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // ==================================================
  // UPDATE TRACKING
  // ==================================================

  const handleTrackingUpdate = async (e) => {
    e.preventDefault();

    if (!currentOrder) return;

    try {
      await updateOrderTracking(currentOrder._id, trackingForm);
    } catch {
      // Redux handles error
    }
  };

  // ==================================================
  // REFRESH
  // ==================================================

  const handleRefresh = () => {
    if (orderId) {
      getAdminOrderById(orderId);
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (detailsLoading) {
    return <OrderDetailsSkeleton />;
  }

  // ==================================================
  // ERROR / NOT FOUND
  // ==================================================

  if (!currentOrder) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-950/30">
          <Package size={28} />
        </div>

        <h2 className="mt-5 text-lg font-bold text-gray-900 dark:text-white">
          Order not found
        </h2>

        <p className="mt-1 max-w-md text-center text-sm text-gray-500 dark:text-gray-400">
          {error || "The requested order could not be found."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/admin/orders")}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </button>
      </div>
    );
  }

  const customer = currentOrder.shippingAddress;

  const itemCount =
    currentOrder.items?.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0,
    ) || 0;

  return (
    <div className="space-y-6 p-5">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Order #{currentOrder.orderNumber}
              </h1>

              <OrderStatusBadge status={currentOrder.orderStatus} />
            </div>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Placed on {formatDateTime(currentOrder.createdAt)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={detailsLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <RefreshCw
            size={16}
            className={detailsLoading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* ==================================================
          ALERTS
      ================================================== */}

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
          <span>{error}</span>

          <button
            type="button"
            onClick={clearAdminOrderError}
            className="font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
          <CheckCircle2 size={17} />
          Order updated successfully.
        </div>
      )}

      {/* ==================================================
          MAIN GRID
      ================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* ==================================================
            LEFT
        ================================================== */}

        <div className="space-y-6 xl:col-span-2">
          {/* ==================================================
              ORDER ITEMS
          ================================================== */}

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 p-5">
            <SectionHeader
              icon={<Package size={18} />}
              title="Order Items"
              subtitle={`${itemCount} ${itemCount === 1 ? "item" : "items"}`}
            />

            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {currentOrder.items?.map((item) => (
                <OrderItem key={item._id} item={item} />
              ))}
            </div>

            <OrderSummary order={currentOrder} />
          </section>

          {/* ==================================================
              SHIPPING ADDRESS
          ================================================== */}

          <ShippingAddress address={customer} />

          {/* ==================================================
              PAYMENT
          ================================================== */}

          <PaymentInformation order={currentOrder} />

          {/* ==================================================
              TRACKING
          ================================================== */}

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <SectionHeader
              icon={<Truck size={18} />}
              title="Shipment Tracking"
              subtitle="Update courier and tracking information"
            />

            <form onSubmit={handleTrackingUpdate} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  label="Courier Name"
                  value={trackingForm.courierName}
                  onChange={(value) =>
                    handleTrackingChange("courierName", value)
                  }
                  placeholder="e.g. Delhivery"
                />

                <FormField
                  label="Tracking Number"
                  value={trackingForm.trackingNumber}
                  onChange={(value) =>
                    handleTrackingChange("trackingNumber", value)
                  }
                  placeholder="e.g. DEL123456789"
                />
              </div>

              <FormField
                label="Tracking URL"
                value={trackingForm.trackingUrl}
                onChange={(value) => handleTrackingChange("trackingUrl", value)}
                placeholder="https://..."
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={trackingLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {trackingLoading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Truck size={16} />
                      Update Tracking
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* ==================================================
            RIGHT
        ================================================== */}

        <div className="space-y-6">
          {/* ==================================================
              CUSTOMER
          ================================================== */}

          <CustomerCard address={customer} user={currentOrder.user} />

          {/* ==================================================
              ORDER STATUS
          ================================================== */}

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <SectionHeader
              icon={<Clock3 size={18} />}
              title="Order Status"
              subtitle="Manage current order status"
            />

            <div className="mt-5">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">
                Status
              </label>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-indigo-950"
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {formatStatus(status)}
                  </option>
                ))}
              </select>

              <button
                type="button"
                disabled={
                  updateLoading || selectedStatus === currentOrder.orderStatus
                }
                onClick={handleStatusUpdate}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updateLoading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    Update Status
                  </>
                )}
              </button>
            </div>
          </section>

          {/* ==================================================
              ORDER TIMELINE
          ================================================== */}

          <OrderTimeline order={currentOrder} />

          {/* ==================================================
              DATES
          ================================================== */}

          <OrderDates order={currentOrder} />
        </div>
      </div>
    </div>
  );
}

// ==================================================
// ORDER ITEM
// ==================================================

function OrderItem({ item }) {
  const productMedia = item.product?.media || [];

  // 1. Variant/order image
  const variantImage = item.image?.url;

  // 2. Product primary image
  const primaryProductImage = productMedia.find(
    (media) => media.isPrimary && media.url,
  )?.url;

  // 3. Any product image as final fallback
  const fallbackProductImage = productMedia.find((media) => media.url)?.url;

  const image =
    variantImage || primaryProductImage || fallbackProductImage || "";

  const attributes = item.attributes ? Object.entries(item.attributes) : [];

  return (
    <div className="flex gap-4 p-5">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
        {image ? (
          <img
            src={image}
            alt={item.productName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <Package size={24} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col justify-between gap-2 sm:flex-row">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              {item.productName}
            </h3>

            {item.sku && (
              <p className="mt-1 text-xs text-gray-400">SKU: {item.sku}</p>
            )}

            {attributes.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {attributes.map(([key, value]) => (
                  <span
                    key={key}
                    className="rounded-lg bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {key}: {formatAttributeValue(value)}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="text-left sm:text-right">
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              ₹{Number(item.total || 0).toLocaleString("en-IN")}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              ₹{Number(item.price || 0).toLocaleString("en-IN")} ×{" "}
              {item.quantity}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================================================
// ORDER SUMMARY
// ==================================================

function OrderSummary({ order }) {
  return (
    <div className="border-t border-gray-100 bg-gray-50/70 p-5 dark:border-gray-800 dark:bg-gray-800/30">
      <div className="ml-auto max-w-sm space-y-3">
        <SummaryRow label="Subtotal" value={order.subtotal} />

        <SummaryRow label="Discount" value={order.discount} negative />

        <SummaryRow label="Shipping" value={order.shippingCharge} />

        <SummaryRow label="Tax" value={order.tax} />

        <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              Total
            </span>

            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
              ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, negative = false }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>

      <span
        className={`font-semibold ${
          negative && value > 0
            ? "text-green-600"
            : "text-gray-800 dark:text-gray-200"
        }`}
      >
        {negative && value > 0 ? "- " : ""}₹
        {Number(value || 0).toLocaleString("en-IN")}
      </span>
    </div>
  );
}

// ==================================================
// SHIPPING ADDRESS
// ==================================================

function ShippingAddress({ address }) {
  if (!address) return null;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <SectionHeader
        icon={<MapPin size={18} />}
        title="Shipping Address"
        subtitle={
          address.addressType
            ? formatStatus(address.addressType)
            : "Delivery address"
        }
      />

      <div className="mt-5 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          {address.name}
        </p>

        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
          {address.addressLine1}
          {address.addressLine2 && (
            <>
              <br />
              {address.addressLine2}
            </>
          )}
          <br />
          {address.city}, {address.state} - {address.pincode}
          {address.landmark && (
            <>
              <br />
              Landmark: {address.landmark}
            </>
          )}
        </p>

        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Phone size={15} />
          {address.phone}
        </div>
      </div>
    </section>
  );
}

// ==================================================
// CUSTOMER CARD
// ==================================================

function CustomerCard({ address, user }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <SectionHeader
        icon={<User size={18} />}
        title="Customer"
        subtitle="Customer information"
      />

      <div className="mt-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <User size={20} />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
            {address?.name ||
              `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
              "Customer"}
          </p>

          {user?.email && (
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          )}
        </div>
      </div>

      {address?.phone && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Phone size={15} />
          {address.phone}
        </div>
      )}
    </section>
  );
}

// ==================================================
// PAYMENT
// ==================================================

function PaymentInformation({ order }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <SectionHeader
        icon={<CreditCard size={18} />}
        title="Payment"
        subtitle="Payment information"
      />

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoBox
          label="Method"
          value={order.paymentMethod === "cod" ? "Cash on Delivery" : "Online"}
        />

        <InfoBox label="Status" value={formatStatus(order.paymentStatus)} />

        <InfoBox
          label="Transaction ID"
          value={order.payment?.transactionId || "—"}
        />

        <InfoBox label="Payment ID" value={order.payment?.paymentId || "—"} />
      </div>

      {order.payment?.paidAt && (
        <p className="mt-4 text-xs text-gray-400">
          Paid on {formatDateTime(order.payment.paidAt)}
        </p>
      )}
    </section>
  );
}

// ==================================================
// TIMELINE
// ==================================================

function OrderTimeline({ order }) {
  const steps = [
    {
      status: "pending",
      label: "Order Placed",
      date: order.createdAt,
    },
    {
      status: "confirmed",
      label: "Confirmed",
    },
    {
      status: "processing",
      label: "Processing",
    },
    {
      status: "shipped",
      label: "Shipped",
      date: order.shippedAt,
    },
    {
      status: "out_for_delivery",
      label: "Out for Delivery",
    },
    {
      status: "delivered",
      label: "Delivered",
      date: order.deliveredAt,
    },
  ];

  const currentIndex = steps.findIndex(
    (step) => step.status === order.orderStatus,
  );

  const isCancelled =
    order.orderStatus === "cancelled" || order.orderStatus === "returned";

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <SectionHeader
        icon={isCancelled ? <XCircle size={18} /> : <Clock3 size={18} />}
        title="Order Timeline"
        subtitle="Order progress"
      />

      <div className="mt-6">
        {isCancelled ? (
          <CancelledTimeline order={order} />
        ) : (
          steps.map((step, index) => {
            const completed = currentIndex >= index;

            const current = currentIndex === index;

            return (
              <TimelineStep
                key={step.status}
                label={step.label}
                completed={completed}
                current={current}
                date={step.date}
                isLast={index === steps.length - 1}
              />
            );
          })
        )}
      </div>
    </section>
  );
}

function TimelineStep({ label, completed, current, date, isLast }) {
  return (
    <div className="relative flex gap-3">
      <div className="relative flex flex-col items-center">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            completed
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-400 dark:bg-gray-800"
          }`}
        >
          {completed ? <CheckCircle2 size={16} /> : <Clock3 size={15} />}
        </div>

        {!isLast && (
          <div
            className={`mt-1 h-10 w-px ${
              completed
                ? "bg-indigo-300 dark:bg-indigo-800"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          />
        )}
      </div>

      <div className="pb-6">
        <p
          className={`text-sm font-bold ${
            current
              ? "text-indigo-600 dark:text-indigo-400"
              : completed
                ? "text-gray-800 dark:text-gray-200"
                : "text-gray-400"
          }`}
        >
          {label}
        </p>

        {date && (
          <p className="mt-1 text-[11px] text-gray-400">
            {formatDateTime(date)}
          </p>
        )}
      </div>
    </div>
  );
}

function CancelledTimeline({ order }) {
  const cancelled = order.cancellation;

  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400">
        {order.orderStatus === "returned" ? (
          <RotateCcw size={16} />
        ) : (
          <XCircle size={16} />
        )}
      </div>

      <div>
        <p className="text-sm font-bold text-red-600 dark:text-red-400">
          {formatStatus(order.orderStatus)}
        </p>

        {cancelled?.cancelledAt && (
          <p className="mt-1 text-[11px] text-gray-400">
            {formatDateTime(cancelled.cancelledAt)}
          </p>
        )}

        {cancelled?.reason && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Reason: {cancelled.reason}
          </p>
        )}
      </div>
    </div>
  );
}

// ==================================================
// ORDER DATES
// ==================================================

function OrderDates({ order }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <SectionHeader
        icon={<Clock3 size={18} />}
        title="Order Dates"
        subtitle="Important timestamps"
      />

      <div className="mt-5 space-y-4">
        <DateRow label="Created" date={order.createdAt} />

        <DateRow label="Shipped" date={order.shippedAt} />

        <DateRow label="Delivered" date={order.deliveredAt} />

        <DateRow label="Cancelled" date={order.cancellation?.cancelledAt} />
      </div>
    </section>
  );
}

function DateRow({ label, date }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>

      <span className="font-medium text-gray-700 dark:text-gray-300">
        {date ? formatDateTime(date) : "—"}
      </span>
    </div>
  );
}

// ==================================================
// FORM FIELD
// ==================================================

function FormField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-indigo-950"
      />
    </div>
  );
}

// ==================================================
// INFO BOX
// ==================================================

function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3.5 dark:bg-gray-800/50">
      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
        {value}
      </p>
    </div>
  );
}

// ==================================================
// SECTION HEADER
// ==================================================

function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
        {icon}
      </div>

      <div>
        <h2 className="text-sm font-bold text-gray-900 dark:text-white">
          {title}
        </h2>

        <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>
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
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${config[status] || config.pending}`}
    >
      {formatStatus(status)}
    </span>
  );
}

// ==================================================
// SKELETON
// ==================================================

function OrderDetailsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-12 w-80 rounded-xl bg-gray-200 dark:bg-gray-800" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <SkeletonCard height="h-[400px]" />
          <SkeletonCard height="h-[220px]" />
          <SkeletonCard height="h-[180px]" />
        </div>

        <div className="space-y-6">
          <SkeletonCard height="h-[180px]" />
          <SkeletonCard height="h-[240px]" />
          <SkeletonCard height="h-[320px]" />
        </div>
      </div>
    </div>
  );
}

function SkeletonCard({ height }) {
  return (
    <div className={`${height} rounded-2xl bg-gray-200 dark:bg-gray-800`} />
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

function formatAttributeValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "object") {
    return value.label || value.value || JSON.stringify(value);
  }

  return String(value);
}

function formatDateTime(date) {
  if (!date) return "";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
