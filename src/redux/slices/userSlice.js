import { createSlice } from "@reduxjs/toolkit";
import { updateProfile } from "../thunks/userThunk";

const initialState = {
  profile: null,

  loading: false,
  initialized: false,

  success: false,

  error: null,
  message: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },

    clearUserMessage: (state) => {
      state.message = null;
    },

    resetUserState: () => initialState,
  },

  extraReducers: (builder) => {
    builder

      // ======================================================
      // UPDATE PROFILE
      // ======================================================

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.profile = action.payload.user;

        state.message =
          action.payload.message || "Profile updated successfully";

        state.error = null;
      })

      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.success = false;

        state.error = action.payload?.message || "Profile update failed";
      });
  },
});

export const { clearUserError, clearUserMessage, resetUserState } =
  userSlice.actions;

export default userSlice.reducer;
