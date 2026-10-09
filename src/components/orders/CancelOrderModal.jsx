import { useState } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";

export default function CancelOrderModal({
  open,
  order,
  loading = false,
  onClose,
  onConfirm,
}) {
  const [selectedReason, setSelectedReason] = useState("");

  const [customReason, setCustomReason] = useState("");

  if (!open || !order) return null;

  const reasons = [
    "Changed my mind",
    "Ordered by mistake",
    "Found a better price",
    "Delivery taking too long",
    "Product no longer needed",
    "Other",
  ];

  const finalReason =
    selectedReason === "Other" ? customReason.trim() : selectedReason;

  const handleConfirm = () => {
    if (!finalReason) return;

    onConfirm(finalReason);
  };

  const handleClose = () => {
    if (loading) return;

    setSelectedReason("");
    setCustomReason("");

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
              <AlertTriangle size={20} />
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Cancel Order
              </h2>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                #{order.orderNumber}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <X size={19} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5">
          <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
            Are you sure you want to cancel this order?
          </p>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200">
              Reason for cancellation
            </label>

            <div className="space-y-2">
              {reasons.map((item) => (
                <label
                  key={item}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                    selectedReason === item
                      ? "border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
                      : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  }`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={item}
                    checked={selectedReason === item}
                    onChange={() => {
                      setSelectedReason(item);

                      if (item !== "Other") {
                        setCustomReason("");
                      }
                    }}
                    disabled={loading}
                    className="h-4 w-4 accent-red-600"
                  />

                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {item}
                  </span>
                </label>
              ))}
            </div>

            {selectedReason === "Other" && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Please enter your reason..."
                rows={3}
                disabled={loading}
                className="mt-3 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex gap-3 border-t border-gray-100 bg-gray-50 px-5 py-4 dark:border-gray-800 dark:bg-gray-950">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-white disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
          >
            Keep Order
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading || !finalReason}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Cancelling...
              </>
            ) : (
              "Cancel Order"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
