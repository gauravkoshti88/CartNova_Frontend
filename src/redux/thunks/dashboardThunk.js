import { createAsyncThunk } from "@reduxjs/toolkit";
import { dashboardService } from "../../services/adminService";

export const getDashboard = createAsyncThunk(
  "dashboard/getDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getDashboard();

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to fetch dashboard data.",
        },
      );
    }
  },
);
