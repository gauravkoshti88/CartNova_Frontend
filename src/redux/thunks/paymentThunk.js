import { createAsyncThunk } from "@reduxjs/toolkit";

import { paymentService } from "../../services/paymentService";

// ==================================================
// HELPER
// ==================================================

const getErrorMessage = (error, fallback) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

// ==================================================
// CREATE PAYMENT INTENT
// POST /api/payment/intent
// ==================================================

export const createPaymentIntent = createAsyncThunk(
  "payment/createPaymentIntent",

  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await paymentService.createPaymentIntent(paymentData);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to create payment intent."),
      );
    }
  },
);

// ==================================================
// GET PAYMENT INTENT
// GET /api/payment/intent/:paymentIntentId
// ==================================================

export const getPaymentIntent = createAsyncThunk(
  "payment/getPaymentIntent",

  async (paymentIntentId, { rejectWithValue }) => {
    try {
      if (!paymentIntentId) {
        return rejectWithValue("Payment intent ID is required.");
      }

      const response = await paymentService.getPaymentIntent(paymentIntentId);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to get payment intent."),
      );
    }
  },
);

// ==================================================
// CANCEL PAYMENT INTENT
// PATCH /api/payment/intent/:paymentIntentId/cancel
// ==================================================

export const cancelPaymentIntent = createAsyncThunk(
  "payment/cancelPaymentIntent",

  async (paymentIntentId, { rejectWithValue }) => {
    try {
      if (!paymentIntentId) {
        return rejectWithValue("Payment intent ID is required.");
      }

      const response =
        await paymentService.cancelPaymentIntent(paymentIntentId);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to cancel payment intent."),
      );
    }
  },
);

// ==================================================
// CREATE RAZORPAY ORDER
// POST /api/payment/razorpay/create-order
// ==================================================

export const createRazorpayOrder = createAsyncThunk(
  "payment/createRazorpayOrder",

  async (paymentIntentId, { rejectWithValue }) => {
    try {
      if (!paymentIntentId) {
        return rejectWithValue("Payment intent ID is required.");
      }

      const response =
        await paymentService.createRazorpayOrder(paymentIntentId);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to create Razorpay order."),
      );
    }
  },
);

// ==================================================
// VERIFY RAZORPAY PAYMENT
// POST /api/payment/razorpay/verify
// ==================================================

export const verifyRazorpayPayment = createAsyncThunk(
  "payment/verifyRazorpayPayment",

  async (paymentData, { rejectWithValue }) => {
    try {
      if (!paymentData) {
        return rejectWithValue("Payment verification data is required.");
      }

      const response = await paymentService.verifyRazorpayPayment(paymentData);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Payment verification failed."),
      );
    }
  },
);
