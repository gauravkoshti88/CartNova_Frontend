import api from "./api";

export const userOrderService = {
  createOrder: (orderData) => api.post("/api/order/create", orderData),

  getMyOrders: (params = {}) =>
    api.get("/api/order/my-orders", {
      params,
    }),

  getMyOrderById: (orderId) => api.get(`/api/order/${orderId}`),

  cancelMyOrder: (orderId, reason = "") =>
    api.patch(`/api/order/${orderId}/cancel`, {
      reason,
    }),
};
