import { createSlice } from "@reduxjs/toolkit";

import {
  createPaymentIntent,
  getPaymentIntent,
  cancelPaymentIntent,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../thunks/paymentThunk";

const initialState = {
  paymentIntent: null,
  razorpayOrder: null,
  payment: null,

  loading: false,
  creatingIntent: false,
  gettingIntent: false,
  cancellingIntent: false,
  creatingRazorpayOrder: false,
  verifyingPayment: false,

  success: false,
  error: null,
  message: "",
};

const paymentSlice = createSlice({
  name: "payment",

  initialState,

  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },

    clearPaymentMessage: (state) => {
      state.message = "";
    },

    clearPaymentState: (state) => {
      state.paymentIntent = null;
      state.razorpayOrder = null;
      state.payment = null;
      state.loading = false;
      state.creatingIntent = false;
      state.gettingIntent = false;
      state.cancellingIntent = false;
      state.creatingRazorpayOrder = false;
      state.verifyingPayment = false;
      state.success = false;
      state.error = null;
      state.message = "";
    },

    resetPaymentSuccess: (state) => {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    // ==================================================
    // CREATE PAYMENT INTENT
    // ==================================================

    builder
      .addCase(createPaymentIntent.pending, (state) => {
        state.creatingIntent = true;
        state.loading = true;
        state.success = false;
        state.error = null;
        state.message = "";
      })

      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.creatingIntent = false;
        state.loading = false;
        state.success = true;

        state.paymentIntent =
          action.payload?.paymentIntent ||
          action.payload?.intent ||
          action.payload?.data ||
          null;

        state.message =
          action.payload?.message || "Payment intent created successfully.";

        state.error = null;
      })

      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.creatingIntent = false;
        state.loading = false;
        state.success = false;

        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to create payment intent.";

        state.message = "";
      });

    // ==================================================
    // GET PAYMENT INTENT
    // ==================================================

    builder
      .addCase(getPaymentIntent.pending, (state) => {
        state.gettingIntent = true;
        state.loading = true;
        state.error = null;
      })

      .addCase(getPaymentIntent.fulfilled, (state, action) => {
        state.gettingIntent = false;
        state.loading = false;
        state.success = true;

        state.paymentIntent =
          action.payload?.paymentIntent ||
          action.payload?.intent ||
          action.payload?.data ||
          action.payload ||
          null;

        state.message = action.payload?.message || "";

        state.error = null;
      })

      .addCase(getPaymentIntent.rejected, (state, action) => {
        state.gettingIntent = false;
        state.loading = false;
        state.success = false;

        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to get payment intent.";
      });

    // ==================================================
    // CANCEL PAYMENT INTENT
    // ==================================================

    builder
      .addCase(cancelPaymentIntent.pending, (state) => {
        state.cancellingIntent = true;
        state.loading = true;
        state.success = false;
        state.error = null;
      })

      .addCase(cancelPaymentIntent.fulfilled, (state, action) => {
        state.cancellingIntent = false;
        state.loading = false;
        state.success = true;

        state.paymentIntent =
          action.payload?.paymentIntent ||
          action.payload?.intent ||
          state.paymentIntent;

        state.message =
          action.payload?.message || "Payment intent cancelled successfully.";

        state.error = null;
      })

      .addCase(cancelPaymentIntent.rejected, (state, action) => {
        state.cancellingIntent = false;
        state.loading = false;
        state.success = false;

        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to cancel payment intent.";
      });

    // ==================================================
    // CREATE RAZORPAY ORDER
    // ==================================================

    builder
      .addCase(createRazorpayOrder.pending, (state) => {
        state.creatingRazorpayOrder = true;
        state.loading = true;
        state.success = false;
        state.error = null;
      })

      .addCase(createRazorpayOrder.fulfilled, (state, action) => {
        state.creatingRazorpayOrder = false;
        state.loading = false;
        state.success = true;

        state.razorpayOrder =
          action.payload?.razorpayOrder ||
          action.payload?.order ||
          action.payload?.data ||
          null;

        state.message =
          action.payload?.message || "Razorpay order created successfully.";

        state.error = null;
      })

      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.creatingRazorpayOrder = false;
        state.loading = false;
        state.success = false;

        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to create Razorpay order.";
      });

    // ==================================================
    // VERIFY RAZORPAY PAYMENT
    // ==================================================

    builder
      .addCase(verifyRazorpayPayment.pending, (state) => {
        state.verifyingPayment = true;
        state.loading = true;
        state.success = false;
        state.error = null;
      })

      .addCase(verifyRazorpayPayment.fulfilled, (state, action) => {
        state.verifyingPayment = false;
        state.loading = false;
        state.success = true;

        state.payment =
          action.payload?.payment ||
          action.payload?.data ||
          action.payload ||
          null;

        state.message =
          action.payload?.message || "Payment verified successfully.";

        state.error = null;
      })

      .addCase(verifyRazorpayPayment.rejected, (state, action) => {
        state.verifyingPayment = false;
        state.loading = false;
        state.success = false;

        state.error =
          action.payload ||
          action.error?.message ||
          "Payment verification failed.";
      });
  },
});

export const {
  clearPaymentError,
  clearPaymentMessage,
  clearPaymentState,
  resetPaymentSuccess,
} = paymentSlice.actions;

export default paymentSlice.reducer;
