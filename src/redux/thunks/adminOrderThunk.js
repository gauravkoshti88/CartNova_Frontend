import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ==================================================
// GET ADMIN ORDERS
// ==================================================

export const getAdminOrders = createAsyncThunk(
  "adminOrder/getAdminOrders",

  async (
    {
      page = 1,
      limit = 20,
      status = "",
      paymentStatus = "",
      paymentMethod = "",
      search = "",
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.get("/api/admin/orders", {
        params: {
          page,
          limit,
          ...(status && { status }),
          ...(paymentStatus && {
            paymentStatus,
          }),
          ...(paymentMethod && {
            paymentMethod,
          }),
          ...(search && { search }),
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders",
      );
    }
  },
);

// ==================================================
// GET ADMIN ORDER BY ID
// ==================================================

export const getAdminOrderById = createAsyncThunk(
  "adminOrder/getAdminOrderById",

  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/admin/orders/${orderId}`);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order",
      );
    }
  },
);

// ==================================================
// UPDATE ORDER STATUS
// ==================================================

export const updateAdminOrderStatus = createAsyncThunk(
  "adminOrder/updateAdminOrderStatus",

  async ({ orderId, orderStatus }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/api/admin/orders/${orderId}/status`, {
        orderStatus,
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order status",
      );
    }
  },
);

// ==================================================
// UPDATE ORDER TRACKING
// ==================================================

export const updateOrderTracking = createAsyncThunk(
  "adminOrder/updateOrderTracking",

  async (
    { orderId, courierName = "", trackingNumber = "", trackingUrl = "" },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.patch(
        `/api/admin/orders/${orderId}/tracking`,
        {
          courierName,
          trackingNumber,
          trackingUrl,
        },
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update tracking",
      );
    }
  },
);
