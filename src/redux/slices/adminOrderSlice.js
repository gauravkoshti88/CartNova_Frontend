import { createSlice } from "@reduxjs/toolkit";

import {
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
  updateOrderTracking,
} from "../thunks/adminOrderThunk.js";

const initialState = {
  orders: [],
  currentOrder: null,
  orderCount: 0,

  loading: false,
  detailsLoading: false,
  updateLoading: false,
  trackingLoading: false,

  error: null,
  success: false,

  pagination: {
    currentPage: 1,
    limit: 20,
    totalOrders: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },

  filters: {
    status: "",
    paymentStatus: "",
    paymentMethod: "",
    search: "",
  },
};

const adminOrderSlice = createSlice({
  name: "adminOrder",

  initialState,

  reducers: {
    clearAdminOrderError: (state) => {
      state.error = null;
    },

    clearAdminOrderSuccess: (state) => {
      state.success = false;
    },

    clearCurrentAdminOrder: (state) => {
      state.currentOrder = null;
    },

    setOrderFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    clearOrderFilters: (state) => {
      state.filters = {
        status: "",
        paymentStatus: "",
        paymentMethod: "",
        search: "",
      };
    },

    resetAdminOrderState: () => initialState,
  },

  extraReducers: (builder) => {
    builder

      .addCase(getAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAdminOrders.fulfilled, (state, action) => {
        state.loading = false;

        state.orders = action.payload.orders || [];
        state.orderCount = action.payload.orders?.length || 0;

        state.pagination = action.payload.pagination || state.pagination;
      })

      .addCase(getAdminOrders.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed to fetch orders";
      })

      // ==================================================
      // GET ORDER DETAILS
      // ==================================================

      .addCase(getAdminOrderById.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })

      .addCase(getAdminOrderById.fulfilled, (state, action) => {
        state.detailsLoading = false;

        state.currentOrder = action.payload.order || null;
      })

      .addCase(getAdminOrderById.rejected, (state, action) => {
        state.detailsLoading = false;

        state.error = action.payload || "Failed to fetch order";
      })

      // ==================================================
      // UPDATE STATUS
      // ==================================================

      .addCase(updateAdminOrderStatus.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(updateAdminOrderStatus.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.success = true;

        const order = action.payload.order;

        if (!order) return;

        state.currentOrder = order;

        const index = state.orders.findIndex((item) => item._id === order._id);

        if (index !== -1) {
          state.orders[index] = order;
        }
      })

      .addCase(updateAdminOrderStatus.rejected, (state, action) => {
        state.updateLoading = false;

        state.error = action.payload || "Failed to update order status";
      })

      // ==================================================
      // UPDATE TRACKING
      // ==================================================

      .addCase(updateOrderTracking.pending, (state) => {
        state.trackingLoading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(updateOrderTracking.fulfilled, (state, action) => {
        state.trackingLoading = false;
        state.success = true;

        const order = action.payload.order;

        if (!order) return;

        state.currentOrder = order;

        const index = state.orders.findIndex((item) => item._id === order._id);

        if (index !== -1) {
          state.orders[index] = order;
        }
      })

      .addCase(updateOrderTracking.rejected, (state, action) => {
        state.trackingLoading = false;

        state.error = action.payload || "Failed to update tracking";
      });
  },
});

export const {
  clearAdminOrderError,
  clearAdminOrderSuccess,
  clearCurrentAdminOrder,
  setOrderFilters,
  clearOrderFilters,
  resetAdminOrderState,
} = adminOrderSlice.actions;

export default adminOrderSlice.reducer;
