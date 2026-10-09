import { useDispatch, useSelector } from "react-redux";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} from "../redux/thunks/orderThunk.js";

import {
  clearOrderError,
  clearOrderSuccess,
  clearCurrentOrder,
  resetOrderState,
} from "../redux/slices/orderSlice.js";

export default function useOrder() {
  const dispatch = useDispatch();

  const orderState = useSelector((state) => state.order);

  const {
    orders = [],
    currentOrder = null,

    loading = false,
    detailsLoading = false,
    createLoading = false,
    cancelLoading = false,

    success = false,
    error = null,

    pagination = {},
  } = orderState;

  return {
    orders,
    currentOrder,

    loading,
    detailsLoading,
    createLoading,
    cancelLoading,

    success,
    error,

    pagination,

    createOrder: (orderData) => dispatch(createOrder(orderData)).unwrap(),

    getMyOrders: (params = {}) => dispatch(getMyOrders(params)).unwrap(),

    getOrderById: (orderId) => dispatch(getOrderById(orderId)).unwrap(),

    cancelOrder: (orderId, reason = "") =>
      dispatch(
        cancelOrder({
          orderId,
          reason,
        }),
      ).unwrap(),

    clearOrderError: () => dispatch(clearOrderError()),

    clearOrderSuccess: () => dispatch(clearOrderSuccess()),

    clearCurrentOrder: () => dispatch(clearCurrentOrder()),

    resetOrderState: () => dispatch(resetOrderState()),
  };
}
