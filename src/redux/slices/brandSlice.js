import { createSlice } from "@reduxjs/toolkit";
import {
  getSelectedBrand,
  createBrand,
  updateBrand,
  updateBrandStatus,
  deleteBrand,
  getAllBrands,
  getBrandsByCategory,
  getAllDeletedBrands,
  undoDeletedBrand,
} from "../thunks/brandThunk";

const initialState = {
  brands: [],
  deletedBrands: [],

  loading: false,
  loaded: false,
  success: false,
  error: null,
  message: "",

  brand: {
    _id: "",
    categories: [],
    name: "",
    description: "",
    image: null,
    status: "active",
  },
  productCount: 0,
};

const brandSlice = createSlice({
  name: "brand",
  initialState,

  reducers: {
    updateBrandField: (state, action) => {
      const { field, value } = action.payload;

      state.brand[field] = value;
    },

    setBrand: (state, action) => {
      state.brand = action.payload;
    },

    resetBrand: (state) => {
      state.brand = {
        _id: "",
        name: "",
        categories: [],
        description: "",
        logo: null,
        status: "active",
      };

      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = "";
    },

    clearBrandState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= GET ALL =================
      .addCase(getAllBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload.brands;
      })
      .addCase(getAllBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch all brands";
      })

      // ================= GET ALL DELETED BRANDS =================
      .addCase(getAllDeletedBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDeletedBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.deletedBrands = action.payload.brands;
      })
      .addCase(getAllDeletedBrands.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch all deleted brands";
      })

      // ================= GET BY CATEGORY =================
      .addCase(getBrandsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBrandsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload.brands;
      })
      .addCase(getBrandsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch category brands";
      })

      // ================= GET SINGLE =================
      .addCase(getSelectedBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getSelectedBrand.fulfilled, (state, action) => {
        state.loading = false;

        state.brand = action.payload.productBrand;
        state.productCount = action.payload.productCount;
      })

      .addCase(getSelectedBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch brand";
      })

      // ================= CREATE =================
      .addCase(createBrand.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        state.brands.unshift(action.payload.brand);
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Failed to create brand";
      })

      // ================= UPDATE =================
      .addCase(updateBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.brand = action.payload.brand;
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update brand";
      })

      // ================= UPDATE STATUS =================
      .addCase(updateBrandStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBrandStatus.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.brands.findIndex(
          (item) => item._id === action.payload.brand._id,
        );

        if (index !== -1) {
          state.brands[index] = action.payload.brand;
        }
      })
      .addCase(updateBrandStatus.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to update brand status";
      })

      // ================= UNDO DELETED BRAND =================
      .addCase(undoDeletedBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(undoDeletedBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        const index = state.deletedBrands.findIndex(
          (item) => item._id === action.payload.brand._id,
        );

        if (index !== -1) {
          state.deletedBrands[index] = action.payload.brand;
        }
      })
      .addCase(undoDeletedBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to undo deleted brand";
      })

      // ================= DELETE =================
      .addCase(deleteBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        const slug = action.payload;

        state.brands = state.brands.filter((brand) => brand.slug !== slug);
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete brand";
      });
  },
});

export const { updateBrandField, setBrand, resetBrand, clearBrandState } =
  brandSlice.actions;

export default brandSlice.reducer;
