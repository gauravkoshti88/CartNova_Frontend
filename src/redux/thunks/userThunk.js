import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "../../services/userService";

// ============================================================
// UPDATE USER PROFILE
// ============================================================

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await userService.updateProfile(formData);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Unable to update profile",
        },
      );
    }
  },
);
