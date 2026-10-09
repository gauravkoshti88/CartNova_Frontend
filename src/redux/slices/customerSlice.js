import { createSlice } from "@reduxjs/toolkit";

import {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  blockCustomer,
  unblockCustomer,
} from "../thunks/customerThunk.js";

const initialState = {
  customers: [],
  customer: null,

  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  filters: {
    search: "",
    status: "all",
    page: 1,
    limit: 10,
  },

  loading: false,
  detailsLoading: false,
  actionLoading: false,

  success: false,

  error: null,
  message: null,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,

  reducers: {
    clearCustomerError: (state) => {
      state.error = null;
    },

    clearCustomerMessage: (state) => {
      state.message = null;
    },

    clearCustomer: (state) => {
      state.customer = null;
    },

    resetCustomerState: (state) => {
      state.customers = [];
      state.customer = null;

      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      };

      state.filters = {
        search: "",
        status: "all",
        page: 1,
        limit: 10,
      };

      state.loading = false;
      state.detailsLoading = false;
      state.actionLoading = false;

      state.success = false;
      state.error = null;
      state.message = null;
    },

    setCustomerFilter: (state, action) => {
      const { key, value } = action.payload;

      state.filters[key] = value;

      if (key !== "page") {
        state.filters.page = 1;
      }
    },

    setCustomerFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
  },

  extraReducers: (builder) => {
    builder

      // =====================================================
      // GET ALL CUSTOMERS
      // =====================================================

      .addCase(getAllCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAllCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.customers = action.payload?.customers || [];

        if (action.payload?.pagination) {
          state.pagination = {
            ...state.pagination,
            ...action.payload.pagination,
          };
        }

        if (action.meta.arg) {
          state.filters = {
            ...state.filters,
            ...action.meta.arg,
          };
        }

        state.message = action.payload?.message || null;
      })

      .addCase(getAllCustomers.rejected, (state, action) => {
        state.loading = false;
        state.success = false;

        state.error = action.payload?.message || "Failed to fetch customers.";
      })

      // =====================================================
      // GET CUSTOMER BY ID
      // =====================================================

      .addCase(getCustomerById.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })

      .addCase(getCustomerById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.success = true;

        state.customer =
          action.payload?.customer || action.payload?.user || null;

        state.message = action.payload?.message || null;
      })

      .addCase(getCustomerById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.success = false;

        state.customer = null;

        state.error = action.payload?.message || "Failed to fetch customer.";
      })

      // =====================================================
      // UPDATE CUSTOMER
      // =====================================================

      .addCase(updateCustomer.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.success = true;

        const updatedCustomer =
          action.payload?.customer || action.payload?.user;

        if (updatedCustomer) {
          state.customer = updatedCustomer;

          const index = state.customers.findIndex(
            (item) => item._id === updatedCustomer._id,
          );

          if (index !== -1) {
            state.customers[index] = updatedCustomer;
          }
        }

        state.message =
          action.payload?.message || "Customer updated successfully.";
      })

      .addCase(updateCustomer.rejected, (state, action) => {
        state.actionLoading = false;
        state.success = false;

        state.error = action.payload?.message || "Failed to update customer.";
      })

      // =====================================================
      // DELETE CUSTOMER
      // =====================================================

      .addCase(deleteCustomer.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.success = true;

        const id = action.payload?.id;

        if (id) {
          state.customers = state.customers.filter(
            (customer) => customer._id !== id,
          );
        }

        if (state.customer?._id === id) {
          state.customer = null;
        }

        state.message =
          action.payload?.message || "Customer deleted successfully.";
      })

      .addCase(deleteCustomer.rejected, (state, action) => {
        state.actionLoading = false;
        state.success = false;

        state.error = action.payload?.message || "Failed to delete customer.";
      })

      // =====================================================
      // BLOCK CUSTOMER
      // =====================================================

      .addCase(blockCustomer.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(blockCustomer.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.success = true;

        const id = action.payload?.id;

        const blockedCustomer =
          action.payload?.customer || action.payload?.user;

        if (blockedCustomer) {
          const index = state.customers.findIndex(
            (customer) => customer._id === blockedCustomer._id,
          );

          if (index !== -1) {
            state.customers[index] = blockedCustomer;
          }

          if (state.customer?._id === blockedCustomer._id) {
            state.customer = blockedCustomer;
          }
        } else if (id) {
          const customer = state.customers.find((item) => item._id === id);

          if (customer) {
            customer.isBlocked = true;
          }

          if (state.customer?._id === id) {
            state.customer.isBlocked = true;
          }
        }

        state.message =
          action.payload?.message || "Customer blocked successfully.";
      })

      .addCase(blockCustomer.rejected, (state, action) => {
        state.actionLoading = false;
        state.success = false;

        state.error = action.payload?.message || "Failed to block customer.";
      })

      // =====================================================
      // UNBLOCK CUSTOMER
      // =====================================================

      .addCase(unblockCustomer.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(unblockCustomer.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.success = true;

        const id = action.payload?.id;

        const unblockedCustomer =
          action.payload?.customer || action.payload?.user;

        if (unblockedCustomer) {
          const index = state.customers.findIndex(
            (customer) => customer._id === unblockedCustomer._id,
          );

          if (index !== -1) {
            state.customers[index] = unblockedCustomer;
          }

          if (state.customer?._id === unblockedCustomer._id) {
            state.customer = unblockedCustomer;
          }
        } else if (id) {
          const customer = state.customers.find((item) => item._id === id);

          if (customer) {
            customer.isBlocked = false;
            customer.blockedReason = null;
            customer.blockedAt = null;
          }

          if (state.customer?._id === id) {
            state.customer.isBlocked = false;
            state.customer.blockedReason = null;
            state.customer.blockedAt = null;
          }
        }

        state.message =
          action.payload?.message || "Customer unblocked successfully.";
      })

      .addCase(unblockCustomer.rejected, (state, action) => {
        state.actionLoading = false;
        state.success = false;

        state.error = action.payload?.message || "Failed to unblock customer.";
      });
  },
});

export const {
  clearCustomerError,
  clearCustomerMessage,
  clearCustomer,
  resetCustomerState,
  setCustomerFilter,
  setCustomerFilters,
} = customerSlice.actions;

export default customerSlice.reducer;
