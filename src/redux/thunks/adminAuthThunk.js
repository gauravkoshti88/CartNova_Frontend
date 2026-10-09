import { createAsyncThunk } from "@reduxjs/toolkit";
import { adminAuthService } from "../../services/authService";

// Login Admin
export const loginAdmin = createAsyncThunk(
  "adminAuth/loginAdmin",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await adminAuthService.adminLogin(credentials);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Admin login failed",
        },
      );
    }
  },
);

// Get Current Admin
export const getAdmin = createAsyncThunk(
  "adminAuth/getAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await adminAuthService.getAdmin();

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Unable to fetch admin",
        },
      );
    }
  },
);

// Logout Admin
export const logoutAdmin = createAsyncThunk(
  "adminAuth/logoutAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await adminAuthService.adminLogout();

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Admin logout failed",
        },
      );
    }
  },
);
