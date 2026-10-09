import { useDispatch, useSelector } from "react-redux";

import {
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
  updateOrderTracking,
} from "../redux/thunks/adminOrderThunk.js";

import {
  clearAdminOrderError,
  clearAdminOrderSuccess,
  clearCurrentAdminOrder,
  setOrderFilters,
  clearOrderFilters,
} from "../redux/slices/adminOrderSlice.js";

export default function useAdminOrder() {
  const dispatch = useDispatch();

  const orderState = useSelector((state) => state.adminOrder);

  const {
    orders,
    currentOrder,

    loading,
    detailsLoading,
    updateLoading,
    trackingLoading,

    error,
    success,

    pagination,
    filters,
  } = orderState;

  return {
    orders,
    currentOrder,

    loading,
    detailsLoading,
    updateLoading,
    trackingLoading,

    error,
    success,

    pagination,
    filters,

    getAdminOrders: (params) => dispatch(getAdminOrders(params)),

    getAdminOrderById: (orderId) => dispatch(getAdminOrderById(orderId)),

    updateAdminOrderStatus: (orderId, orderStatus) =>
      dispatch(
        updateAdminOrderStatus({
          orderId,
          orderStatus,
        }),
      ).unwrap(),

    updateOrderTracking: (orderId, trackingData) =>
      dispatch(
        updateOrderTracking({
          orderId,
          ...trackingData,
        }),
      ).unwrap(),

    setOrderFilters: (filters) => dispatch(setOrderFilters(filters)),

    clearOrderFilters: () => dispatch(clearOrderFilters()),

    clearAdminOrderError: () => dispatch(clearAdminOrderError()),

    clearAdminOrderSuccess: () => dispatch(clearAdminOrderSuccess()),

    clearCurrentAdminOrder: () => dispatch(clearCurrentAdminOrder()),
  };
}
