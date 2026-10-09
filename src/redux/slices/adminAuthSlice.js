import { createSlice } from "@reduxjs/toolkit";
import { loginAdmin, logoutAdmin, getAdmin } from "../thunks/adminAuthThunk";

const initialState = {
  admin: null,
  isAuthenticated: false,
  success: false,

  loading: false,
  initialized: false,

  error: null,
  message: null,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",

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
      state.error = null;
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= Login =================

      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.success = true;

        state.admin = action.payload.adminObj;
        state.isAuthenticated = true;
        state.message = action.payload.message;
      })

      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.success = false;

        state.error = action.payload?.message;
        state.isAuthenticated = false;
      })

      // ================= Get Current Admin =================

      .addCase(getAdmin.pending, (state) => {
        state.loading = true;
      })

      .addCase(getAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;

        state.admin = action.payload.admin;
        state.isAuthenticated = true;
      })

      .addCase(getAdmin.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.success = false;

        state.admin = null;
        state.isAuthenticated = false;
      })

      // ================= Logout =================

      .addCase(logoutAdmin.pending, (state) => {
        state.loading = true;
      })

      .addCase(logoutAdmin.fulfilled, (state) => {
        state.loading = false;
        state.success = true;

        state.admin = null;
        state.isAuthenticated = false;
        state.message = null;
        state.error = null;
      })

      .addCase(logoutAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        state.success = false;
      });
  },
});

export const { clearError, clearMessage, resetState } = adminAuthSlice.actions;

export default adminAuthSlice.reducer;
