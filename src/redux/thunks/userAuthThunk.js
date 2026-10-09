import { createAsyncThunk } from "@reduxjs/toolkit";
import { userAuthService } from "../../services/authService";

// Login With Google
export const googleLogin = createAsyncThunk(
  "userAuth/googleLogin",
  async (credential, { rejectWithValue }) => {
    try {
      const response = await userAuthService.googleLogin({ credential });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Google login failed.",
      );
    }
  },
);

// Register User
export const registerUser = createAsyncThunk(
  "userAuth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await userAuthService.register(userData);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Registration failed",
        },
      );
    }
  },
);

// Login User
export const loginUser = createAsyncThunk(
  "userAuth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await userAuthService.login(credentials);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Login failed",
        },
      );
    }
  },
);

// ==================================================
// SEND LOGIN OTP
// ==================================================

export const sendLoginOtp = createAsyncThunk(
  "userAuth/sendLoginOtp",
  async (phone, { rejectWithValue }) => {
    try {
      const { data } = await userAuthService.sendLoginOtp({
        phone,
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to send OTP.",
        },
      );
    }
  },
);

// ==================================================
// VERIFY LOGIN OTP
// ==================================================

export const verifyLoginOtp = createAsyncThunk(
  "userAuth/verifyLoginOtp",
  async ({ phone, otp }, { rejectWithValue }) => {
    try {
      const { data } = await userAuthService.verifyLoginOtp({
        phone,
        otp,
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "OTP verification failed.",
        },
      );
    }
  },
);

// Get Current User
export const getUser = createAsyncThunk(
  "userAuth/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await userAuthService.getUser();

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Unable to fetch user",
        },
      );
    }
  },
);

// Logout User
export const logoutUser = createAsyncThunk(
  "userAuth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await userAuthService.logout();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Logout failed",
        },
      );
    }
  },
);

export const sendResetPasswordOtp = createAsyncThunk(
  "userAuth/sendResetPasswordOtp",
  async (phone, { rejectWithValue }) => {
    try {
      const { data } = await userAuthService.sendResetOtp({
        phone,
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to send OTP.",
        },
      );
    }
  },
);

export const verifyResetPasswordOtp = createAsyncThunk(
  "userAuth/verifyResetPasswordOtp",
  async ({ phone, otp }, { rejectWithValue }) => {
    try {
      const { data } = await userAuthService.verifyResetOtp({
        phone,
        otp,
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Invalid OTP.",
        },
      );
    }
  },
);

export const resetPassword = createAsyncThunk(
  "userAuth/resetPassword",
  async (
    { phone, resetToken, newPassword, confirmPassword },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await userAuthService.resetPassword({
        phone,
        resetToken,
        newPassword,
        confirmPassword,
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Password reset failed.",
        },
      );
    }
  },
);
