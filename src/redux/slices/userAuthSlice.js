import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  sendLoginOtp,
  verifyLoginOtp,
  resetPassword,
  verifyResetPasswordOtp,
  sendResetPasswordOtp,
  googleLogin,
} from "../thunks/userAuthThunk";

const initialState = {
  user: null,
  isAuthenticated: false,

  loading: false,
  success: false,
  initialized: false,

  error: null,
  message: null,

  // OTP
  otpSent: false,
  otpLoading: false,
  otpVerifying: false,
  otpError: null,
  devOtp: null,

  // RESET PASSWORD
  resetOtpLoading: false,
  resetOtpSent: false,
  resetOtpVerified: false,
  resetOtp: null,
  resetToken: null,
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    clearMessage: (state) => {
      state.message = null;
    },

    resetState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = null;
    },
    clearOtpState: (state) => {
      state.otpSent = false;
      state.otpLoading = false;
      state.otpVerifying = false;
      state.otpError = null;
      state.devOtp = null;
    },
    clearResetPasswordState: (state) => {
      state.resetOtpLoading = false;
      state.resetOtpSent = false;
      state.resetOtpVerified = false;
      state.resetOtp = null;
      state.resetToken = null;
      state.error = null;
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= Login =================
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.success = true;

        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.message = action.payload.message;
      })

      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.success = false;

        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message;
      })

      // ================= Register =================
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // ================= Login =================
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.success = true;

        state.user = action.payload.userObj;
        state.isAuthenticated = true;
        state.message = action.payload.message;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.success = false;

        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message;
      })

      // ==================================================
      // SEND LOGIN OTP
      // ==================================================

      .addCase(sendLoginOtp.pending, (state) => {
        state.otpLoading = true;
        state.otpError = null;
        state.devOtp = null;
      })

      .addCase(sendLoginOtp.fulfilled, (state, action) => {
        state.otpLoading = false;
        state.otpSent = true;
        state.otpError = null;

        // DEV ONLY
        state.devOtp = action.payload?.devOtp || null;

        state.message = action.payload?.message || "OTP sent successfully.";
      })

      .addCase(sendLoginOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.otpSent = false;
        state.otpError = action.payload?.message || "Failed to send OTP.";
      })

      // ==================================================
      // VERIFY LOGIN OTP
      // ==================================================

      .addCase(verifyLoginOtp.pending, (state) => {
        state.otpVerifying = true;
        state.otpError = null;
      })

      .addCase(verifyLoginOtp.fulfilled, (state, action) => {
        state.otpVerifying = false;

        state.loading = false;
        state.initialized = true;
        state.success = true;

        state.user = action.payload.userObj;
        state.isAuthenticated = true;

        state.message = action.payload?.message || "Login successful.";

        state.otpSent = false;
        state.devOtp = null;
      })

      .addCase(verifyLoginOtp.rejected, (state, action) => {
        state.otpVerifying = false;
        state.success = false;

        state.otpError = action.payload?.message || "Invalid OTP.";
      })

      // ================= Get Current User =================
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.success = true;

        state.user = action.payload.user;
        state.isAuthenticated = true;
      })

      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.success = false;

        state.user = null;
        state.isAuthenticated = false;
      })

      // ================= Logout =================
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;

        state.user = null;
        state.isAuthenticated = false;

        state.success = true;
        state.message = action.payload?.message || "Logout successful";
        state.error = null;
      })

      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(sendResetPasswordOtp.pending, (state) => {
        state.resetOtpLoading = true;
        state.error = null;
        state.resetOtp = null;
      })

      .addCase(sendResetPasswordOtp.fulfilled, (state, action) => {
        state.resetOtpLoading = false;
        state.resetOtpSent = true;
        state.resetOtp = action.payload.devOtp || null;
        state.message = action.payload.message;
      })

      .addCase(sendResetPasswordOtp.rejected, (state, action) => {
        state.resetOtpLoading = false;
        state.resetOtpSent = false;
        state.error = action.payload?.message;
      })

      .addCase(verifyResetPasswordOtp.pending, (state) => {
        state.resetOtpLoading = true;
        state.error = null;
      })

      .addCase(verifyResetPasswordOtp.fulfilled, (state, action) => {
        state.resetOtpLoading = false;
        state.resetOtpVerified = true;
        state.resetToken = action.payload.resetToken;
        state.message = action.payload.message;
      })

      .addCase(verifyResetPasswordOtp.rejected, (state, action) => {
        state.resetOtpLoading = false;
        state.resetOtpVerified = false;
        state.error = action.payload?.message;
      })

      .addCase(resetPassword.pending, (state) => {
        state.resetOtpLoading = true;
        state.error = null;
      })

      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetOtpLoading = false;
        state.message = action.payload.message;

        state.resetOtpSent = false;
        state.resetOtpVerified = false;
        state.resetOtp = null;
        state.resetToken = null;
      })

      .addCase(resetPassword.rejected, (state, action) => {
        state.resetOtpLoading = false;
        state.error = action.payload?.message;
      });
  },
});

export const {
  clearError,
  clearMessage,
  resetState,
  clearOtpState,
  clearResetPasswordState,
} = userAuthSlice.actions;

export default userAuthSlice.reducer;
