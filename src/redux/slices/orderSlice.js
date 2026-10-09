import { createSlice } from "@reduxjs/toolkit";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} from "../thunks/orderThunk";

const initialState = {
  orders: [],
  currentOrder: null,

  loading: false,
  detailsLoading: false,
  createLoading: false,
  cancelLoading: false,

  success: false,
  error: null,

  pagination: {
    currentPage: 1,
    limit: 10,
    totalOrders: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const orderSlice = createSlice({
  name: "order",
  initialState,

  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },

    clearOrderSuccess: (state) => {
      state.success = false;
    },

    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },

    resetOrderState: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.createLoading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createLoading = false;
        state.success = true;
        state.error = null;

        state.currentOrder = action.payload.order || null;

        if (action.payload.order) {
          state.orders = [action.payload.order, ...state.orders];
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.createLoading = false;
        state.success = false;
        state.error = action.payload || "Failed to create order";
      })

      // Get orders
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.orders = action.payload.orders || [];

        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch orders";
      })

      // Get order details
      .addCase(getOrderById.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.error = null;

        state.currentOrder = action.payload.order || null;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload || "Failed to fetch order";
      })

      // Cancel order
      .addCase(cancelOrder.pending, (state) => {
        state.cancelLoading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.cancelLoading = false;
        state.success = true;
        state.error = null;

        const updatedOrder = action.payload.order;

        if (updatedOrder) {
          state.currentOrder = updatedOrder;

          const index = state.orders.findIndex(
            (order) => order._id === updatedOrder._id,
          );

          if (index !== -1) {
            state.orders[index] = updatedOrder;
          }
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.cancelLoading = false;
        state.success = false;
        state.error = action.payload || "Failed to cancel order";
      });
  },
});

export const {
  clearOrderError,
  clearOrderSuccess,
  clearCurrentOrder,
  resetOrderState,
} = orderSlice.actions;

export default orderSlice.reducer;
