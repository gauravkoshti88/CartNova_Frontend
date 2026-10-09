import { createAsyncThunk } from "@reduxjs/toolkit";

import { userOrderService } from "../../services/orderService";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await userOrderService.createOrder(orderData);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to create order",
      );
    }
  },
);

export const getMyOrders = createAsyncThunk(
  "order/getMyOrders",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await userOrderService.getMyOrders(params);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch orders",
      );
    }
  },
);

export const getOrderById = createAsyncThunk(
  "order/getOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await userOrderService.getMyOrderById(orderId);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch order",
      );
    }
  },
);

export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async ({ orderId, reason = "" }, { rejectWithValue }) => {
    try {
      const response = await userOrderService.cancelMyOrder(orderId, reason);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to cancel order",
      );
    }
  },
);
