import { createSlice } from "@reduxjs/toolkit";
import { getDashboard } from "../thunks/dashboardThunk";

const initialState = {
  dashboard: {
    overview: {
      customers: {
        total: 0,
        active: 0,
        blocked: 0,
      },

      orders: {
        total: 0,
      },

      products: {
        total: 0,
        published: 0,
        draft: 0,
      },

      categories: {
        total: 0,
      },

      subCategories: {
        total: 0,
      },

      childCategories: {
        total: 0,
      },

      brands: {
        total: 0,
      },
    },

    orders: {
      total: 0,
      status: {},
      payment: {},
      method: {},
      period: {},
    },

    revenue: {
      total: 0,
      paid: 0,
      refunded: 0,
      today: 0,
      thisMonth: 0,
    },

    inventory: {
      totalVariants: 0,
      totalStock: 0,
      outOfStockVariants: 0,
      lowStockVariants: 0,
    },

    lowStockProducts: [],
    recentCustomers: [],
    recentOrders: [],
    topProducts: [],
    salesTrend: [],
  },

  loading: false,
  error: null,
  message: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,

  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },

    clearDashboardMessage: (state) => {
      state.message = null;
    },

    resetDashboard: () => initialState,
  },

  extraReducers: (builder) => {
    builder

      // ================= GET DASHBOARD =================

      .addCase(getDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getDashboard.fulfilled, (state, action) => {
        state.loading = false;

        state.dashboard = {
          ...state.dashboard,
          ...(action.payload?.dashboard || {}),
        };

        state.message = action.payload?.message || null;
        state.error = null;
      })

      .addCase(getDashboard.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Failed to load dashboard.";
      });
  },
});

export const { clearDashboardError, clearDashboardMessage, resetDashboard } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;
