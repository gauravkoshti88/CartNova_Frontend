import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Check,
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
  Loader2,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import useCart from "../../hooks/useCart";
import useOrder from "../../hooks/useOrder";

import { loadRazorpay } from "../../utils/loadRazorpay";

import {
  createPaymentIntent,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../../redux/thunks/paymentThunk.js";

import {
  clearPaymentError,
  clearPaymentState,
} from "../../redux/slices/paymentSlice.js";

import { clearCart } from "../../redux/thunks/cartThunk.js";

import Breadcrumb from "../../components/Breadcrumb";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function Checkout() {
  useDocumentTitle("Checkout");

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // AUTH
  const { isAuthenticated } = useSelector((state) => state.userAuth);
  const { website } = useSelector((state) => state.website);

  // PAYMENT REDUX
  const {
    paymentIntent,
    razorpayOrder,
    creatingIntent,
    creatingRazorpayOrder,
    verifyingPayment,
    error: paymentError,
  } = useSelector((state) => state.payment);

  // CART
  const { items: cartItems = [], loading: cartLoading } = useCart();

  // ORDER
  const {
    createOrder,
    createLoading,
    error: orderError,
    clearOrderError,
  } = useOrder();

  // PAYMENT METHOD
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // ADDRESS
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    addressType: "home",
  });

  // LOCAL STATES
  const [formError, setFormError] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // CLEAR PAYMENT STATE
  useEffect(() => {
    dispatch(clearPaymentState());

    return () => {
      dispatch(clearPaymentState());
    };
  }, [dispatch]);

  // CART REDIRECT
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    if (!cartLoading && !cartItems.length) {
      navigate("/cart", {
        replace: true,
      });
    }
  }, [isAuthenticated, cartLoading, cartItems.length, navigate]);

  // AUTH REDIRECT
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          message: "Please login to continue to checkout.",
        }}
      />
    );
  }

  // PRICE CALCULATION
  const pricing = useMemo(() => {
    let subtotal = 0;

    cartItems.forEach((item) => {
      const variant = getCartItemVariant(item);

      const price = Number(variant?.salePrice || 0);
      const quantity = Number(item.quantity || 1);

      subtotal += price * quantity;
    });

    const discount = 0;
    const shippingCharge = subtotal > 999 || subtotal === 0 ? 0 : 79;
    const tax = 0;

    const totalAmount = subtotal - discount + shippingCharge + tax;

    return {
      subtotal,
      discount,
      shippingCharge,
      tax,
      totalAmount,
    };
  }, [cartItems]);

  // ADDRESS CHANGE
  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setAddress((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");
  };

  // VALIDATE ADDRESS
  const validateAddress = () => {
    const requiredFields = [
      "name",
      "phone",
      "addressLine1",
      "city",
      "state",
      "pincode",
    ];

    for (const field of requiredFields) {
      if (!address[field]?.trim()) {
        return `Please enter ${getFieldLabel(field)}.`;
      }
    }

    if (!/^[6-9]\d{9}$/.test(address.phone.trim())) {
      return "Please enter a valid 10-digit phone number.";
    }

    if (!/^\d{6}$/.test(address.pincode.trim())) {
      return "Please enter a valid 6-digit pincode.";
    }

    return "";
  };

  // CREATE PAYMENT INTENT
  const handleCreatePaymentIntent = async () => {
    const idempotencyKey = `online_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}`;

    const paymentIntentResponse = await dispatch(
      createPaymentIntent({
        shippingAddress: address,
        paymentMethod: "online",
        idempotencyKey,
      }),
    ).unwrap();

    const intent =
      paymentIntentResponse?.paymentIntent ||
      paymentIntentResponse?.intent ||
      paymentIntentResponse?.data ||
      paymentIntentResponse;

    if (!intent?._id && !intent?.id) {
      throw new Error("Payment intent was not created.");
    }

    return intent;
  };

  // ONLINE PAYMENT
  const handleOnlinePayment = async () => {
    try {
      clearOrderError();

      dispatch(clearPaymentError());

      setFormError("");
      setPaymentProcessing(true);

      // VALIDATE ADDRESS
      const validationError = validateAddress();

      if (validationError) {
        setFormError(validationError);
        setPaymentProcessing(false);
        return;
      }

      // VALIDATE CART
      if (!cartItems.length) {
        setFormError("Your cart is empty.");
        setPaymentProcessing(false);
        return;
      }

      // VALIDATE AMOUNT
      if (pricing.totalAmount <= 0) {
        setFormError("Invalid order amount.");
        setPaymentProcessing(false);
        return;
      }

      // LOAD RAZORPAY
      const loaded = await loadRazorpay();

      if (!loaded) {
        setFormError(
          "Unable to load Razorpay. Please check your internet connection.",
        );

        setPaymentProcessing(false);
        return;
      }

      // CREATE PAYMENT INTENT
      const intent = await handleCreatePaymentIntent();

      const paymentIntentId = intent?._id || intent?.id;

      if (!paymentIntentId) {
        throw new Error("Payment intent ID is missing.");
      }

      // CREATE RAZORPAY ORDER
      const razorpayResponse = await dispatch(
        createRazorpayOrder(paymentIntentId),
      ).unwrap();

      const razorpayOrderData =
        razorpayResponse?.razorpayOrder ||
        razorpayResponse?.order ||
        razorpayResponse?.data;

      if (!razorpayOrderData?.id) {
        throw new Error("Failed to create Razorpay order.");
      }

      // RAZORPAY OPTIONS
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: razorpayOrderData.amount,

        currency: razorpayOrderData.currency || "INR",

        name: "CartNova",

        description: "CartNova Order Payment",

        image: website?.general?.darkLogo?.url || "",

        order_id: razorpayOrderData.id,

        // PAYMENT SUCCESS
        handler: async (razorpayPaymentResponse) => {
          try {
            setPaymentProcessing(true);

            dispatch(clearPaymentError());

            // VERIFY RAZORPAY PAYMENT
            const verificationResponse = await dispatch(
              verifyRazorpayPayment({
                paymentIntentId,

                razorpayOrderId: razorpayPaymentResponse.razorpay_order_id,

                razorpayPaymentId: razorpayPaymentResponse.razorpay_payment_id,

                razorpaySignature: razorpayPaymentResponse.razorpay_signature,
              }),
            ).unwrap();

            if (!verificationResponse?.success) {
              throw new Error(
                verificationResponse?.message || "Payment verification failed.",
              );
            }

            // GET ORDER CREATED DURING PAYMENT FINALIZATION
            const order =
              verificationResponse?.order ||
              verificationResponse?.data?.order ||
              verificationResponse?.paymentIntent?.order ||
              verificationResponse?.data?.paymentIntent?.order;

            if (!order?._id) {
              throw new Error(
                "Payment was verified successfully, but the order details were not returned.",
              );
            }

            // CLEAR CART
            await dispatch(clearCart()).unwrap();

            // SUCCESS
            toast.success("Payment successful! Order placed successfully.");

            setPaymentProcessing(false);

            navigate(`/user/order-success/${order._id}`, {
              replace: true,
              state: {
                order,
              },
            });
          } catch (error) {
            console.error("ONLINE PAYMENT ERROR:", error);

            const message =
              error?.response?.data?.message ||
              error?.message ||
              "Payment was successful, but order confirmation failed.";

            toast.error(message);

            setFormError(message);

            setPaymentProcessing(false);
          }
        },

        // PREFILL
        prefill: {
          name: address.name,
          contact: address.phone,
        },

        // NOTES
        notes: {
          source: "CartNova-checkout",
          paymentIntentId,
        },

        // THEME
        theme: {
          color: "#4f46e5",
          backdrop_color: "#00000080",
        },

        // MODAL
        modal: {
          backdropclose: false,
          escape: true,
          handleback: true,
          confirm_close: true,

          ondismiss: () => {
            setPaymentProcessing(false);

            toast.error("Razorpay checkout dismissed.");
          },
        },
      };

      // CREATE RAZORPAY INSTANCE
      const razorpay = new window.Razorpay(options);

      // PAYMENT FAILED
      razorpay.on("payment.failed", (response) => {
        const message =
          response?.error?.description || "Payment failed. Please try again.";

        setFormError(message);
        setPaymentProcessing(false);

        toast.error(message);
      });

      // OPEN RAZORPAY
      razorpay.open();
    } catch (error) {
      console.error("START ONLINE PAYMENT ERROR:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to start online payment.";

      setFormError(message);
      setPaymentProcessing(false);
    }
  };

  // PLACE ORDER
  const handlePlaceOrder = async () => {
    clearOrderError();

    dispatch(clearPaymentError());

    setFormError("");

    // VALIDATION
    const validationError = validateAddress();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    if (!cartItems.length) {
      setFormError("Your cart is empty.");
      return;
    }

    // ONLINE
    if (paymentMethod === "online") {
      await handleOnlinePayment();
      return;
    }

    // COD
    const orderData = {
      shippingAddress: address,

      paymentMethod: "cod",

      idempotencyKey: `cod_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}`,
    };

    try {
      setPaymentProcessing(true);

      const response = await createOrder(orderData);

      const order = response?.order;

      if (!order?._id) {
        throw new Error("Order was not created successfully.");
      }

      // CLEAR CART
      await dispatch(clearCart()).unwrap();

      toast.success("Order placed successfully!");

      setPaymentProcessing(false);

      navigate(`/user/order-success/${order._id}`, {
        replace: true,

        state: {
          order,
        },
      });
    } catch (error) {
      console.error("CREATE COD ORDER ERROR:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to place order.";

      setFormError(message);
      setPaymentProcessing(false);
    }
  };

  // LOADING
  if (cartLoading) {
    return <CheckoutSkeleton />;
  }

  if (!cartItems.length) {
    return null;
  }

  // ERRORS
  const combinedError = formError || orderError || paymentError;

  // LOADING STATE
  const isLoading =
    createLoading ||
    paymentProcessing ||
    creatingIntent ||
    creatingRazorpayOrder ||
    verifyingPayment;

  // UI
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 sm:py-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb />

        {/* HEADER */}
        <div className="mb-6">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
          >
            <ArrowLeft size={16} />
            Back
          </Link>

          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Checkout
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Complete your order securely.
          </p>
        </div>

        {/* ERROR */}
        {combinedError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            {combinedError}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* LEFT */}
          <div className="space-y-6">
            {/* SHIPPING ADDRESS */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
              <SectionHeader
                icon={<MapPin size={19} />}
                title="Shipping Address"
                description="Where should we deliver your order?"
              />

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  name="name"
                  value={address.name}
                  onChange={handleAddressChange}
                  placeholder="Enter full name"
                  required
                />

                <Input
                  label="Phone Number"
                  name="phone"
                  value={address.phone}
                  onChange={handleAddressChange}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  required
                />

                <div className="sm:col-span-2">
                  <Input
                    label="Address Line 1"
                    name="addressLine1"
                    value={address.addressLine1}
                    onChange={handleAddressChange}
                    placeholder="House no., building, street"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <Input
                    label="Address Line 2"
                    name="addressLine2"
                    value={address.addressLine2}
                    onChange={handleAddressChange}
                    placeholder="Apartment, area, locality (optional)"
                  />
                </div>

                <Input
                  label="City"
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  placeholder="City"
                  required
                />

                <Input
                  label="State"
                  name="state"
                  value={address.state}
                  onChange={handleAddressChange}
                  placeholder="State"
                  required
                />

                <Input
                  label="Pincode"
                  name="pincode"
                  value={address.pincode}
                  onChange={handleAddressChange}
                  placeholder="6-digit pincode"
                  maxLength={6}
                  required
                />

                <Input
                  label="Landmark"
                  name="landmark"
                  value={address.landmark}
                  onChange={handleAddressChange}
                  placeholder="Nearby landmark (optional)"
                />
              </div>

              {/* ADDRESS TYPE */}
              <div className="mt-5">
                <p className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Address Type
                </p>

                <div className="flex flex-wrap gap-3">
                  {[
                    ["home", "Home"],
                    ["office", "Office"],
                    ["other", "Other"],
                  ].map(([value, label]) => (
                    <label
                      key={value}
                      className={`cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                        address.addressType === value
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                      }`}
                    >
                      <input
                        type="radio"
                        name="addressType"
                        value={value}
                        checked={address.addressType === value}
                        onChange={handleAddressChange}
                        className="sr-only"
                      />

                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </section>

            {/* PAYMENT */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
              <SectionHeader
                icon={<CreditCard size={19} />}
                title="Payment Method"
                description="Choose how you want to pay."
              />

              <div className="mt-6 space-y-3">
                <PaymentOption
                  value="cod"
                  selected={paymentMethod === "cod"}
                  onChange={setPaymentMethod}
                  title="Cash on Delivery"
                  description="Pay when your order arrives."
                  icon={<Truck size={20} />}
                />

                <PaymentOption
                  value="online"
                  selected={paymentMethod === "online"}
                  onChange={setPaymentMethod}
                  title="Online Payment"
                  description="Pay securely using UPI, card or net banking."
                  icon={<CreditCard size={20} />}
                />
              </div>
            </section>

            {/* SECURITY */}
            <div className="flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-950/20">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-green-600 dark:text-green-400"
              />

              <div>
                <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                  Safe & Secure Checkout
                </p>

                <p className="mt-1 text-xs leading-5 text-green-700 dark:text-green-400">
                  Your order information is securely processed and your payment
                  details are protected.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <OrderSummary
              items={cartItems}
              pricing={pricing}
              paymentMethod={paymentMethod}
              loading={isLoading}
              onPlaceOrder={handlePlaceOrder}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

// GET CART ITEM VARIANT
function getCartItemVariant(item) {
  return (
    item.product?.variants?.find(
      (variant) => String(variant.id) === String(item.variantId),
    ) || null
  );
}

// ORDER SUMMARY
function OrderSummary({
  items,
  pricing,
  paymentMethod,
  loading,
  onPlaceOrder,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-b border-gray-100 p-5 dark:border-gray-800">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Order Summary
        </h2>

        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {items.length} {items.length === 1 ? "item" : "items"} in your order
        </p>
      </div>

      {/* ITEMS */}
      <div className="max-h-[360px] space-y-4 overflow-y-auto p-5">
        {items.map((item) => {
          const variant = getCartItemVariant(item);

          const price = Number(variant?.salePrice || 0);
          const quantity = Number(item.quantity || 1);

          const productName = item.product?.basicInfo?.productName || "Product";

          const image =
            variant?.image?.url ||
            item.product?.media?.find((media) => media.isPrimary)?.url ||
            item.product?.media?.[0]?.url ||
            "";

          return (
            <div
              key={`${item.product?._id || item.product}-${item.variantId}`}
              className="flex gap-3"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                {image ? (
                  <img
                    src={image}
                    alt={productName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    <Package size={22} />
                  </div>
                )}

                <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] font-bold text-white">
                  {quantity}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {productName}
                </p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  ₹{formatMoney(price)}
                </p>
              </div>

              <p className="text-sm font-bold text-gray-900 dark:text-white">
                ₹{formatMoney(price * quantity)}
              </p>
            </div>
          );
        })}
      </div>

      {/* PRICE */}
      <div className="border-t border-gray-100 p-5 dark:border-gray-800">
        <div className="space-y-3 text-sm">
          <PriceRow label="Subtotal" value={pricing.subtotal} />

          <PriceRow label="Discount" value={-pricing.discount} negative />

          <PriceRow
            label="Shipping"
            value={pricing.shippingCharge}
            free={pricing.shippingCharge === 0}
          />

          <PriceRow label="Tax" value={pricing.tax} />
        </div>

        <div className="my-5 border-t border-dashed border-gray-200 dark:border-gray-700" />

        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-gray-900 dark:text-white">
            Total
          </span>

          <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
            ₹{formatMoney(pricing.totalAmount)}
          </span>
        </div>

        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={loading}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />

              {paymentMethod === "online"
                ? "Processing Payment..."
                : "Placing Order..."}
            </>
          ) : (
            <>
              {paymentMethod === "online" ? (
                <>
                  <CreditCard size={18} />
                  Pay ₹{formatMoney(pricing.totalAmount)}
                </>
              ) : (
                <>
                  <Check size={18} />
                  Place Order
                </>
              )}
            </>
          )}
        </button>

        <p className="mt-3 text-center text-[11px] leading-5 text-gray-400">
          Payment Method:{" "}
          <span className="font-semibold capitalize">
            {paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
          </span>
        </p>
      </div>
    </div>
  );
}

// PAYMENT OPTION
function PaymentOption({
  value,
  selected,
  onChange,
  title,
  description,
  icon,
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${
        selected
          ? "border-indigo-500 bg-indigo-50/60 dark:border-indigo-500 dark:bg-indigo-950/20"
          : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
      }`}
    >
      <input
        type="radio"
        name="paymentMethod"
        value={value}
        checked={selected}
        onChange={() => onChange(value)}
        className="sr-only"
      />

      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          selected
            ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
            : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>

      <div
        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
          selected
            ? "border-indigo-600"
            : "border-gray-300 dark:border-gray-600"
        }`}
      >
        {selected && <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />}
      </div>
    </label>
  );
}

// SECTION HEADER
function SectionHeader({ icon, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
        {icon}
      </div>

      <div>
        <h2 className="text-base font-bold text-gray-900 dark:text-white">
          {title}
        </h2>

        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
}

// INPUT
function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  maxLength,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-gray-700 dark:text-gray-300">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-indigo-950"
      />
    </div>
  );
}

// PRICE ROW
function PriceRow({ label, value, negative = false, free = false }) {
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
            negative
              ? "text-green-600 dark:text-green-400"
              : "text-gray-900 dark:text-gray-200"
          }`}
        >
          {negative ? "-₹" : "₹"}

          {formatMoney(Math.abs(value))}
        </span>
      )}
    </div>
  );
}

// SKELETON
function CheckoutSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl animate-pulse px-4 sm:px-6 lg:px-8">
        <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800" />

        <div className="mt-5 h-9 w-40 rounded bg-gray-200 dark:bg-gray-800" />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <div className="h-[520px] rounded-2xl bg-gray-200 dark:bg-gray-800" />

            <div className="h-56 rounded-2xl bg-gray-200 dark:bg-gray-800" />
          </div>

          <div className="h-[560px] rounded-2xl bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </main>
  );
}

// FORMAT MONEY
function formatMoney(value) {
  return Number(value || 0).toLocaleString("en-IN");
}

// FIELD LABEL
function getFieldLabel(field) {
  const labels = {
    name: "your name",
    phone: "your phone number",
    addressLine1: "your address",
    city: "your city",
    state: "your state",
    pincode: "your pincode",
  };

  return labels[field] || field;
}
