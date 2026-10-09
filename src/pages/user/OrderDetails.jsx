import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  CreditCard,
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
  RotateCcw,
  ExternalLink,
} from "lucide-react";

import useOrder from "../../hooks/useOrder";
import CancelOrderModal from "../../components/orders/CancelOrderModal";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function OrderDetails() {
  useDocumentTitle("Order Details");

  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const stateOrder = location.state?.order || null;

  const {
    currentOrder,
    detailsLoading,
    cancelLoading,
    error,

    getOrderById,
    cancelOrder,

    clearOrderError,
    clearOrderSuccess,
  } = useOrder();

  const order = currentOrder || stateOrder;

  useEffect(() => {
    if (!orderId) return;

    getOrderById(orderId);

    return () => {
      clearOrderError();
    };
  }, [orderId]);

  const handleCancelOrder = async (reason) => {
    try {
      await cancelOrder(orderId, reason);

      setCancelModalOpen(false);

      await getOrderById(orderId);

      clearOrderSuccess();
    } catch {
      // Redux error already handles it
    }
  };

  if (detailsLoading && !order) {
    return <OrderDetailsSkeleton />;
  }

  if (error && !order) {
    return (
      <main className="min-h-screen bg-gray-50 py-10 dark:bg-gray-950">
        <div className="mx-auto max-w-3xl px-4">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center dark:border-red-900 dark:bg-gray-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-950/40">
              <XCircle size={28} />
            </div>

            <h1 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
              Unable to load order
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {error}
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  clearOrderError();
                  getOrderById(orderId);
                }}
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Try Again
              </button>

              <button
                type="button"
                onClick={() => navigate("/user/my-orders")}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                My Orders
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ==================================================
  // NOT FOUND
  // ==================================================

  if (!order) {
    return <OrderNotFound />;
  }

  const isCancelled = order.orderStatus === "cancelled";
  const isReturned = order.orderStatus === "returned";

  const canCancel = ["pending", "confirmed", "processing"].includes(
    order.orderStatus,
  );

  return (
    <main className="min-h-screen bg-gray-50 py-6 dark:bg-gray-950 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* BACK */}
        <Link
          to="/user/my-orders"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
        >
          <ArrowLeft size={17} />
          Back
        </Link>

        {/* HEADER */}
        <OrderHeader order={order} />

        {/* CANCELLED */}
        {isCancelled && <CancelledNotice cancellation={order.cancellation} />}

        {/* RETURNED */}
        {isReturned && <ReturnedNotice />}

        {/* TIMELINE */}
        {!isCancelled && !isReturned && (
          <OrderTimeline
            status={order.orderStatus}
            createdAt={order.createdAt}
            shippedAt={order.shippedAt}
            deliveredAt={order.deliveredAt}
          />
        )}

        {/* MAIN */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* LEFT */}
          <div className="space-y-6">
            <OrderItems items={order.items || []} />

            <ShippingAddress address={order.shippingAddress} />

            {order.tracking?.trackingNumber && (
              <TrackingCard tracking={order.tracking} />
            )}
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <PaymentCard order={order} />

            <PriceSummary order={order} />

            <OrderActions
              order={order}
              canCancel={canCancel}
              onCancel={() => setCancelModalOpen(true)}
            />
          </div>
        </div>
      </div>

      <CancelOrderModal
        open={cancelModalOpen}
        order={order}
        loading={cancelLoading}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancelOrder}
      />
    </main>
  );
}

// ==================================================
// ORDER HEADER
// ==================================================

function OrderHeader({ order }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
              Order #{order.orderNumber}
            </h1>

            <StatusBadge status={order.orderStatus} />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} />
              {formatDate(order.createdAt)}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Package size={14} />
              {order.items?.length || 0}{" "}
              {order.items?.length === 1 ? "item" : "items"}
            </span>
          </div>
        </div>

        <div className="sm:text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Order Total
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            ₹{formatMoney(order.totalAmount)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ==================================================
// ORDER TIMELINE
// ==================================================

function OrderTimeline({ status, createdAt, shippedAt, deliveredAt }) {
  const steps = [
    {
      key: "pending",
      label: "Order Placed",
      description: "Your order has been placed.",
      date: createdAt,
    },
    {
      key: "confirmed",
      label: "Confirmed",
      description: "Your order has been confirmed.",
    },
    {
      key: "processing",
      label: "Processing",
      description: "Your order is being prepared.",
    },
    {
      key: "shipped",
      label: "Shipped",
      description: "Your order has been shipped.",
      date: shippedAt,
    },
    {
      key: "out_for_delivery",
      label: "Out for Delivery",
      description: "Your order is on the way.",
    },
    {
      key: "delivered",
      label: "Delivered",
      description: "Your order has been delivered.",
      date: deliveredAt,
    },
  ];

  const statusIndex = getStatusIndex(status);

  return (
    <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      <div className="mb-7">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Order Status
        </h2>

        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Track the progress of your order.
        </p>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block">
        <div className="relative">
          <div className="absolute left-0 right-0 top-5 h-0.5 bg-gray-200 dark:bg-gray-800" />

          <div
            className="absolute left-0 top-5 h-0.5 bg-indigo-600 transition-all duration-500"
            style={{
              width:
                statusIndex <= 0
                  ? "0%"
                  : `${(statusIndex / (steps.length - 1)) * 100}%`,
            }}
          />

          <div className="relative grid grid-cols-6">
            {steps.map((step, index) => {
              const completed = index <= statusIndex;
              const active = index === statusIndex;

              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white dark:border-gray-900 ${
                      completed
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-400 dark:bg-gray-800"
                    }`}
                  >
                    {completed ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <Clock3 size={17} />
                    )}
                  </div>

                  <p
                    className={`mt-3 text-xs font-semibold ${
                      completed
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>

                  {active && (
                    <p className="mt-1 max-w-[130px] text-[10px] leading-4 text-indigo-600 dark:text-indigo-400">
                      {step.description}
                    </p>
                  )}

                  {step.date && completed && (
                    <p className="mt-1 text-[10px] text-gray-400">
                      {formatDate(step.date)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="md:hidden">
        <div className="relative ml-4 border-l border-gray-200 dark:border-gray-800">
          {steps.map((step, index) => {
            const completed = index <= statusIndex;
            const active = index === statusIndex;

            return (
              <div key={step.key} className="relative pb-7 pl-8 last:pb-0">
                <div
                  className={`absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white dark:border-gray-900 ${
                    completed
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-400 dark:bg-gray-800"
                  }`}
                >
                  {completed ? (
                    <CheckCircle2 size={12} />
                  ) : (
                    <Clock3 size={11} />
                  )}
                </div>

                <p
                  className={`text-sm font-semibold ${
                    completed
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>

                {active && (
                  <p className="mt-1 text-xs text-indigo-600 dark:text-indigo-400">
                    {step.description}
                  </p>
                )}

                {step.date && completed && (
                  <p className="mt-1 text-[11px] text-gray-400">
                    {formatDate(step.date)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ==================================================
// ORDER ITEMS
// ==================================================

function OrderItems({ items = [] }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800 sm:px-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Order Items
        </h2>

        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {items.length} {items.length === 1 ? "product" : "products"} in this
          order
        </p>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {items.length > 0 ? (
          items.map((item) => <OrderItem key={item._id} item={item} />)
        ) : (
          <div className="p-8 text-center text-sm text-gray-500">
            No items found.
          </div>
        )}
      </div>
    </section>
  );
}

// ==================================================
// ORDER ITEM
// ==================================================

function OrderItem({ item }) {
  const productMedia = item.product?.media || [];

  const selectedVariant = item.product?.variants?.find(
    (variant) => String(variant._id) === String(item.variantId),
  );

  const variantImage =
    selectedVariant?.images?.find((image) => image.isPrimary)?.url ||
    selectedVariant?.images?.[0]?.url ||
    "";

  const productImage =
    productMedia.find((image) => image.isPrimary)?.url ||
    productMedia[0]?.url ||
    "";

  const image = item.image?.url || variantImage || productImage || "";

  return (
    <div className="p-5 sm:p-6">
      <div className="flex gap-4">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 sm:h-28 sm:w-28">
          {image ? (
            <img
              src={image}
              alt={item.image?.alt || item.productName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              <Package size={30} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white sm:text-base">
            {item.productName}
          </h3>

          {item.sku && (
            <p className="mt-1 text-xs text-gray-400">SKU: {item.sku}</p>
          )}

          {item.attributes && Object.keys(item.attributes).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(item.attributes).map(([key, value]) => (
                <span
                  key={key}
                  className="rounded-md bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                >
                  {formatAttribute(key)}: {formatAttributeValue(value)}
                </span>
              ))}
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
            <span>
              Qty:{" "}
              <strong className="text-gray-700 dark:text-gray-300">
                {item.quantity}
              </strong>
            </span>

            <span>
              Unit Price:{" "}
              <strong className="text-gray-700 dark:text-gray-300">
                ₹{formatMoney(item.price)}
              </strong>
            </span>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-sm font-bold text-gray-900 dark:text-white sm:text-base">
            ₹{formatMoney(item.total)}
          </p>

          {item.mrp > item.price && (
            <p className="mt-1 text-xs text-gray-400 line-through">
              ₹{formatMoney(item.mrp)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================================================
// SHIPPING ADDRESS
// ==================================================

function ShippingAddress({ address }) {
  if (!address) return null;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <MapPin size={19} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Shipping Address
          </h2>

          <p className="text-xs capitalize text-gray-500 dark:text-gray-400">
            {address.addressType || "home"} address
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-gray-50 p-4 dark:bg-gray-950">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">
          {address.name}
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
          {address.addressLine1}
          {address.addressLine2 && (
            <>
              <br />
              {address.addressLine2}
            </>
          )}
          <br />
          {address.city}, {address.state} - {address.pincode}
        </p>

        {address.landmark && (
          <p className="mt-2 text-xs text-gray-500">
            Landmark: {address.landmark}
          </p>
        )}

        <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          Phone: {address.phone}
        </p>
      </div>
    </section>
  );
}

// ==================================================
// TRACKING
// ==================================================

function TrackingCard({ tracking }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
          <Truck size={19} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Shipment Tracking
          </h2>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Track your package
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <TrackingInfo
          label="Courier"
          value={tracking.courierName || "Not available"}
        />

        <TrackingInfo
          label="Tracking Number"
          value={tracking.trackingNumber || "Not available"}
        />
      </div>

      {tracking.trackingUrl && (
        <a
          href={tracking.trackingUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Track Shipment
          <ExternalLink size={15} />
        </a>
      )}
    </section>
  );
}

function TrackingInfo({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-950">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>

      <p className="mt-1 break-all text-sm font-semibold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

// ==================================================
// PAYMENT
// ==================================================

function PaymentCard({ order }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400">
          <CreditCard size={19} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Payment
          </h2>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Payment information
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <InfoRow
          label="Method"
          value={
            order.paymentMethod === "cod"
              ? "Cash on Delivery"
              : "Online Payment"
          }
        />

        <InfoRow
          label="Status"
          value={<PaymentStatus status={order.paymentStatus} />}
        />

        {order.payment?.provider && (
          <InfoRow label="Provider" value={order.payment.provider} />
        )}

        {order.payment?.paymentId && (
          <InfoRow label="Payment ID" value={order.payment.paymentId} />
        )}

        {order.payment?.transactionId && (
          <InfoRow label="Transaction ID" value={order.payment.transactionId} />
        )}

        {order.payment?.paidAt && (
          <InfoRow label="Paid At" value={formatDate(order.payment.paidAt)} />
        )}
      </div>
    </section>
  );
}

// ==================================================
// PRICE
// ==================================================

function PriceSummary({ order }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        Price Details
      </h2>

      <div className="mt-5 space-y-3">
        <PriceRow label="Subtotal" value={order.subtotal} />

        {Number(order.discount || 0) > 0 && (
          <PriceRow label="Discount" value={order.discount} negative />
        )}

        <PriceRow label="Shipping" value={order.shippingCharge} />

        <PriceRow label="Tax" value={order.tax} />

        <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
          <PriceRow label="Total Amount" value={order.totalAmount} total />
        </div>
      </div>
    </section>
  );
}

function PriceRow({ label, value, negative = false, total = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={
          total
            ? "text-sm font-bold text-gray-900 dark:text-white"
            : "text-sm text-gray-500 dark:text-gray-400"
        }
      >
        {label}
      </span>

      <span
        className={
          total
            ? "text-base font-bold text-gray-900 dark:text-white"
            : negative
              ? "text-sm font-semibold text-green-600 dark:text-green-400"
              : "text-sm font-semibold text-gray-800 dark:text-gray-200"
        }
      >
        {negative ? "- " : ""}₹{formatMoney(value)}
      </span>
    </div>
  );
}

// ==================================================
// ACTIONS
// ==================================================

function OrderActions({ order, canCancel, onCancel }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        Need Help?
      </h2>

      <div className="mt-4 space-y-2">
        {canCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            <XCircle size={16} />
            Cancel Order
          </button>
        )}

        {order.orderStatus === "delivered" && (
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <RotateCcw size={16} />
            Return / Replacement
          </button>
        )}

        <Link
          to="/contact"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900"
        >
          Need Help?
        </Link>
      </div>
    </div>
  );
}

// ==================================================
// NOTICES
// ==================================================

function CancelledNotice({ cancellation }) {
  return (
    <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
          <XCircle size={20} />
        </div>

        <div>
          <h2 className="font-bold text-red-800 dark:text-red-300">
            Order Cancelled
          </h2>

          {cancellation?.reason && (
            <p className="mt-1 text-sm text-red-700 dark:text-red-400">
              Reason: {cancellation.reason}
            </p>
          )}

          {cancellation?.cancelledAt && (
            <p className="mt-1 text-xs text-red-600/70">
              Cancelled on {formatDate(cancellation.cancelledAt)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ReturnedNotice() {
  return (
    <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-900 dark:bg-orange-950/30">
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
          <RotateCcw size={20} />
        </div>

        <div>
          <h2 className="font-bold text-orange-800 dark:text-orange-300">
            Order Returned
          </h2>

          <p className="mt-1 text-sm text-orange-700 dark:text-orange-400">
            This order has been marked as returned.
          </p>
        </div>
      </div>
    </div>
  );
}

// ==================================================
// INFO
// ==================================================

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>

      <span className="max-w-[65%] break-all text-right text-xs font-semibold text-gray-800 dark:text-gray-200">
        {value}
      </span>
    </div>
  );
}

// ==================================================
// PAYMENT STATUS
// ==================================================

function PaymentStatus({ status }) {
  const config = {
    pending: ["Pending", "text-yellow-600 dark:text-yellow-400"],

    paid: ["Paid", "text-green-600 dark:text-green-400"],

    failed: ["Failed", "text-red-600 dark:text-red-400"],

    refunded: ["Refunded", "text-purple-600 dark:text-purple-400"],

    partially_refunded: [
      "Partially Refunded",
      "text-orange-600 dark:text-orange-400",
    ],
  };

  const [label, className] = config[status] || config.pending;

  return <span className={className}>{label}</span>;
}

// ==================================================
// STATUS
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

  const [label, className] = config[status] || config.pending;

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  );
}

// ==================================================
// HELPERS
// ==================================================

function getStatusIndex(status) {
  const statuses = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "out_for_delivery",
    "delivered",
  ];

  const index = statuses.indexOf(status);

  return index === -1 ? 0 : index;
}

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

function formatAttribute(key) {
  return String(key)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatAttributeValue(value) {
  if (value === null || value === undefined) {
    return "-";
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    if (value.label) return String(value.label);
    if (value.value) return String(value.value);

    return Object.values(value)
      .map((v) => String(v))
      .join(", ");
  }

  return String(value);
}

// ==================================================
// NOT FOUND
// ==================================================

function OrderNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800">
          <Package size={30} />
        </div>

        <h1 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
          Order Not Found
        </h1>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          We couldn't find the requested order.
        </p>

        <Link
          to="/user/my-orders"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </Link>
      </div>
    </main>
  );
}

// ==================================================
// SKELETON
// ==================================================

function OrderDetailsSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50 py-8 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl animate-pulse px-4 sm:px-6 lg:px-8">
        <div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-800" />

        <div className="mt-6 h-32 rounded-2xl bg-white dark:bg-gray-900" />

        <div className="mt-6 h-48 rounded-2xl bg-white dark:bg-gray-900" />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="h-96 rounded-2xl bg-white dark:bg-gray-900" />

          <div className="h-80 rounded-2xl bg-white dark:bg-gray-900" />
        </div>
      </div>
    </main>
  );
}
