import { useDispatch, useSelector } from "react-redux";

import {
  createPaymentIntent,
  getPaymentIntent,
  cancelPaymentIntent,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../redux/thunks/paymentThunk.js";

import {
  clearPaymentError,
  clearPaymentSuccess,
  clearPaymentMessage,
  clearPaymentIntent,
  clearRazorpayOrder,
  clearPaymentResult,
  resetPaymentState,
} from "../redux/slices/paymentSlice.js";

export default function usePayment() {
  const dispatch = useDispatch();

  const paymentState = useSelector((state) => state.payment);

  return {
    ...paymentState,

    createPaymentIntent: (data) => dispatch(createPaymentIntent(data)).unwrap(),

    getPaymentIntent: (paymentIntentId) =>
      dispatch(getPaymentIntent(paymentIntentId)).unwrap(),

    cancelPaymentIntent: (paymentIntentId) =>
      dispatch(cancelPaymentIntent(paymentIntentId)).unwrap(),

    createRazorpayOrder: (data) => dispatch(createRazorpayOrder(data)).unwrap(),

    verifyRazorpayPayment: (data) =>
      dispatch(verifyRazorpayPayment(data)).unwrap(),

    clearPaymentError: () => dispatch(clearPaymentError()),

    clearPaymentSuccess: () => dispatch(clearPaymentSuccess()),

    clearPaymentMessage: () => dispatch(clearPaymentMessage()),

    clearPaymentIntent: () => dispatch(clearPaymentIntent()),

    clearRazorpayOrder: () => dispatch(clearRazorpayOrder()),

    clearPaymentResult: () => dispatch(clearPaymentResult()),

    resetPaymentState: () => dispatch(resetPaymentState()),
  };
}
