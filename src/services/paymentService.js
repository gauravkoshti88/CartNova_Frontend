import api from "./api";

export const paymentService = {
  createPaymentIntent: (paymentData) =>
    api.post("/api/payment/intent", paymentData),

  getPaymentIntent: (paymentIntentId) =>
    api.get(`/api/payment/intent/${paymentIntentId}`),

  cancelPaymentIntent: (paymentIntentId) =>
    api.patch(`/api/payment/intent/${paymentIntentId}/cancel`),

  createRazorpayOrder: (paymentIntentId) =>
    api.post("/api/payment/razorpay/create-order", {
      paymentIntentId,
    }),

  verifyRazorpayPayment: (paymentData) =>
    api.post("/api/payment/razorpay/verify", paymentData),
};
