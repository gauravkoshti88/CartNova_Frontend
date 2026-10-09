import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  blockCustomer,
  unblockCustomer,
} from "../redux/thunks/customerThunk.js";

import {
  clearCustomerError,
  clearCustomerMessage,
  clearCustomer,
  resetCustomerState,
  setCustomerFilter,
  setCustomerFilters,
} from "../redux/slices/customerSlice.js";

export default function useCustomer() {
  const dispatch = useDispatch();

  const customerState = useSelector((state) => state.customer || {});

  const {
    customers = [],
    customer = null,

    pagination = {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },

    filters = {
      search: "",
      status: "all",
      page: 1,
      limit: 10,
    },

    loading = false,
    detailsLoading = false,
    actionLoading = false,

    success = false,
    error = null,
    message = null,
  } = customerState;

  // ==========================================================
  // GET ALL CUSTOMERS
  // ==========================================================

  const fetchCustomers = useCallback(
    (params = {}) => {
      const finalParams = {
        ...filters,
        ...params,
      };

      return dispatch(getAllCustomers(finalParams));
    },
    [dispatch, filters],
  );

  // ==========================================================
  // GET CUSTOMER
  // ==========================================================

  const fetchCustomer = useCallback(
    (id) => {
      if (!id) return;

      return dispatch(getCustomerById(id));
    },
    [dispatch],
  );

  // ==========================================================
  // UPDATE
  // ==========================================================

  const editCustomer = useCallback(
    (id, data) => {
      return dispatch(
        updateCustomer({
          id,
          data,
        }),
      );
    },
    [dispatch],
  );

  // ==========================================================
  // DELETE
  // ==========================================================

  const removeCustomer = useCallback(
    (id) => {
      return dispatch(deleteCustomer(id));
    },
    [dispatch],
  );

  // ==========================================================
  // BLOCK
  // ==========================================================

  const block = useCallback(
    (id, reason = "") => {
      return dispatch(
        blockCustomer({
          id,
          reason,
        }),
      );
    },
    [dispatch],
  );

  // ==========================================================
  // UNBLOCK
  // ==========================================================

  const unblock = useCallback(
    (id) => {
      return dispatch(unblockCustomer(id));
    },
    [dispatch],
  );

  // ==========================================================
  // FILTER
  // ==========================================================

  const updateFilter = useCallback(
    (key, value) => {
      dispatch(
        setCustomerFilter({
          key,
          value,
        }),
      );
    },
    [dispatch],
  );

  const updateFilters = useCallback(
    (data) => {
      dispatch(setCustomerFilters(data));
    },
    [dispatch],
  );

  // ==========================================================
  // CLEAR
  // ==========================================================

  const clearError = useCallback(() => {
    dispatch(clearCustomerError());
  }, [dispatch]);

  const clearMessage = useCallback(() => {
    dispatch(clearCustomerMessage());
  }, [dispatch]);

  const clearSelectedCustomer = useCallback(() => {
    dispatch(clearCustomer());
  }, [dispatch]);

  const reset = useCallback(() => {
    dispatch(resetCustomerState());
  }, [dispatch]);

  return {
    customers,
    customer,

    pagination,
    filters,

    loading,
    detailsLoading,
    actionLoading,

    success,
    error,
    message,

    fetchCustomers,
    fetchCustomer,

    editCustomer,
    removeCustomer,

    block,
    unblock,

    updateFilter,
    updateFilters,

    clearError,
    clearMessage,
    clearSelectedCustomer,

    reset,
  };
}
