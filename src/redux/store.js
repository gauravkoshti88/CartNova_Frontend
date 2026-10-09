import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice.js";
import productReducer from "./slices/productSlice.js";
import adminAuthReducer from "./slices/adminAuthSlice.js";
import userAuthReducer from "./slices/userAuthSlice.js";
import categoryReducer from "./slices/categorySlice.js";
import subCategoryReducer from "./slices/subCategorySlice.js";
import childCategoryReducer from "./slices/childCategorySlice.js";
import brandReducer from "./slices/brandSlice.js";
import websiteReducer from "./slices/websiteSlice.js";
import publicProductReducer from "./slices/publicProductSlice.js";
import publicCategoryReducer from "./slices/publicCategorySlice.js";
import cartReducer from "./slices/cartSlice.js";
import userReducer from "./slices/userSlice.js";
import orderReducer from "./slices/orderSlice.js";
import adminOrderReducer from "./slices/adminOrderSlice.js";
import wishlistReducer from "./slices/wishlistSlice.js";
import customerReducer from "./slices/customerSlice.js";
import dashboardReducer from "./slices/dashboardSlice";
import chatReducer from "./slices/chatSlice.js";
import paymentReducer from "./slices/paymentSlice.js";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    website: websiteReducer,
    user: userReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,

    order: orderReducer,
    payment: paymentReducer,

    publicProduct: publicProductReducer,
    publicCategory: publicCategoryReducer,

    userAuth: userAuthReducer,

    adminAuth: adminAuthReducer,

    chat: chatReducer,

    dashboard: dashboardReducer,
    product: productReducer,
    category: categoryReducer,
    subCategory: subCategoryReducer,
    childCategory: childCategoryReducer,
    brand: brandReducer,
    customer: customerReducer,

    adminOrder: adminOrderReducer,
  },
});
