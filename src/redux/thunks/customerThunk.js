import { createAsyncThunk } from "@reduxjs/toolkit";
import { customerService } from "../../services/customerService";

export const getAllCustomers = createAsyncThunk(
  "customer/getAllCustomers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await customerService.getAllCustomers(params);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch customers.",
        },
      );
    }
  },
);

export const getCustomerById = createAsyncThunk(
  "customer/getCustomerById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await customerService.getCustomerById(id);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch customer.",
        },
      );
    }
  },
);

export const updateCustomer = createAsyncThunk(
  "customer/updateCustomer",
  async ({ id, data: customerData }, { rejectWithValue }) => {
    try {
      const { data } = await customerService.updateCustomer(id, customerData);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to update customer.",
        },
      );
    }
  },
);

export const deleteCustomer = createAsyncThunk(
  "customer/deleteCustomer",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await customerService.deleteCustomer(id);

      return {
        ...data,
        id,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to delete customer.",
        },
      );
    }
  },
);

export const blockCustomer = createAsyncThunk(
  "customer/blockCustomer",
  async ({ id, reason = "" }, { rejectWithValue }) => {
    try {
      const { data } = await customerService.blockCustomer(id, {
        reason,
      });

      return {
        ...data,
        id,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to block customer.",
        },
      );
    }
  },
);

export const unblockCustomer = createAsyncThunk(
  "customer/unblockCustomer",
  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue({
          message: "Customer ID is required.",
        });
      }
      const { data } = await customerService.unblockCustomer(id);

      return {
        ...data,
        id,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to unblock customer.",
        },
      );
    }
  },
);
