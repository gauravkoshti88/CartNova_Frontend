import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import {
  AdminProtectedRoute,
  AdminPublicRoute,
  UserProtectedRoute,
} from "./ProtectedRoute.jsx";

import { Loader } from "../components/States.jsx";

// Lazy Loading Helper
const withSuspense = (element) => (
  <Suspense fallback={<Loader fullPage />}>{element}</Suspense>
);

// Layouts
const LazyAuthLayout = lazy(() => import("../layouts/AuthLayout.jsx"));

const LazyPublicLayout = lazy(() => import("../layouts/user/PublicLayout.jsx"));

const LazyAdminLayout = lazy(() => import("../layouts/admin/AdminLayout.jsx"));

// Public Pages

const Home = lazy(() => import("../pages/public/Home.jsx"));

const Shop = lazy(() => import("../pages/public/Shop.jsx"));

const Categories = lazy(() => import("../pages/public/Categories.jsx"));

const CategoryProducts = lazy(
  () => import("../pages/public/CategoryProducts.jsx"),
);

const LazyLogin = lazy(() =>
  import("../pages/auth/AuthPage.jsx").then((m) => ({ default: m.Login })),
);

const LazyRegister = lazy(() =>
  import("../pages/auth/AuthPage.jsx").then((m) => ({ default: m.Register })),
);

const LazyAdminLogin = lazy(() =>
  import("../pages/auth/AuthPage.jsx").then((m) => ({ default: m.AdminLogin })),
);

const ProductDetails = lazy(() => import("../pages/public/ProductDetails.jsx"));

const Offers = lazy(() => import("../pages/public/Offers.jsx"));

const NewArrivals = lazy(() => import("../pages/public/NewArrivals.jsx"));

const BestSellers = lazy(() => import("../pages/public/BestSellers.jsx"));

const About = lazy(() => import("../pages/public/About.jsx"));

const Contact = lazy(() => import("../pages/public/Contact.jsx"));

const Cart = lazy(() => import("../pages/public/Cart.jsx"));

const Wishlist = lazy(() => import("../pages/public/Wishlist.jsx"));

// Authentication Pages
const AuthPage = lazy(() => import("../pages/auth/AuthPage.jsx"));

const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword.jsx"));

// User Pages
const Checkout = lazy(() => import("../pages/user/Checkout.jsx"));

const OrderSuccess = lazy(() => import("../pages/user/OrderSuccess.jsx"));

const MyOrders = lazy(() => import("../pages/user/MyOrders.jsx"));

const UserOrderDetails = lazy(() => import("../pages/user/OrderDetails.jsx"));

const MyProfile = lazy(() => import("../pages/user/MyProfile.jsx"));

// Admin Pages
const Dashboard = lazy(() => import("../pages/admin/Dashboard.jsx"));

const AdminChatPage = lazy(() => import("../pages/admin/AdminChatPage.jsx"));

const AdminOrders = lazy(() => import("../pages/admin/Orders.jsx"));

const AdminOrderDetails = lazy(
  () => import("../pages/admin/AdminOrderDetails.jsx"),
);

const Products = lazy(() => import("../pages/admin/Products.jsx"));

const AdminCategories = lazy(() => import("../pages/admin/Categories.jsx"));

const SubCategories = lazy(() => import("../pages/admin/SubCategories.jsx"));

const ChildCategories = lazy(
  () => import("../pages/admin/ChildCategories.jsx"),
);

const Brands = lazy(() => import("../pages/admin/Brands.jsx"));

const Customers = lazy(() => import("../pages/admin/Customers.jsx"));

// Admin Forms
const AdditionalForm = lazy(
  () => import("../components/admin_comp/AdditionalForm.jsx"),
);

const ChildCategoryForm = lazy(
  () => import("../components/admin_comp/ChildCategoryForm.jsx"),
);

const EditCategory = lazy(
  () => import("../components/admin_comp/EditCategory.jsx"),
);

const EditSubCategory = lazy(
  () => import("../components/admin_comp/EditSubCategory.jsx"),
);

const EditChildCategory = lazy(
  () => import("../components/admin_comp/EditChildCategory.jsx"),
);

const EditBrand = lazy(() => import("../components/admin_comp/EditBrand.jsx"));

const ProductForm = lazy(
  () => import("../components/admin_comp/ProductForm.jsx"),
);

const EditProduct = lazy(
  () => import("../components/admin_comp/EditProduct.jsx"),
);

// Website Settings Pages
const WebsiteGeneral = lazy(() => import("../pages/admin/website/General.jsx"));

const HeroBanner = lazy(() => import("../pages/admin/website/HeroBanner.jsx"));

const OfferBanner = lazy(
  () => import("../pages/admin/website/OfferBanner.jsx"),
);

const WebsiteAbout = lazy(() => import("../pages/admin/website/About.jsx"));

const WebsiteContact = lazy(() => import("../pages/admin/website/Contact.jsx"));

const Social = lazy(() => import("../pages/admin/website/Social.jsx"));

const Footer = lazy(() => import("../pages/admin/website/Footer.jsx"));

const Seo = lazy(() => import("../pages/admin/website/Seo.jsx"));

// Not Found
const NotFound = lazy(() => import("../pages/NotFound.jsx"));

// Router Configuration
export const router = createBrowserRouter([
  // Public Website Routes
  {
    path: "/",
    element: withSuspense(<LazyPublicLayout />),
    children: [
      {
        index: true,
        element: withSuspense(<Home />),
      },
      {
        path: "shop",
        element: withSuspense(<Shop />),
      },
      {
        path: "categories",
        element: withSuspense(<Categories />),
      },
      {
        path: "categories/:slug",
        element: withSuspense(<CategoryProducts />),
      },
      {
        path: "product/category/:categorySlug/:slug",
        element: withSuspense(<ProductDetails />),
      },
      {
        path: "offers",
        element: withSuspense(<Offers />),
      },
      {
        path: "new-arrivals",
        element: withSuspense(<NewArrivals />),
      },
      {
        path: "best-sellers",
        element: withSuspense(<BestSellers />),
      },
      {
        path: "about",
        element: withSuspense(<About />),
      },
      {
        path: "contact",
        element: withSuspense(<Contact />),
      },
      {
        path: "cart",
        element: withSuspense(<Cart />),
      },
      {
        path: "wishlist",
        element: withSuspense(<Wishlist />),
      },
    ],
  },

  // Authentication Routes
  {
    element: withSuspense(<LazyAuthLayout />),
    children: [
      {
        path: "/login",
        element: withSuspense(<LazyLogin />),
      },
      {
        path: "/register",
        element: withSuspense(<LazyRegister />),
      },
      {
        path: "/forgot-password",
        element: withSuspense(<ForgotPassword />),
      },
      {
        path: "/admin/login",
        element: withSuspense(<LazyAdminLogin />),
      },
    ],
  },

  // Admin Public Routes
  {
    element: <AdminPublicRoute />,
    children: [
      {
        element: withSuspense(<LazyAuthLayout />),
        children: [
          {
            path: "/admin/login",
            element: withSuspense(<AuthPage.AdminLogin />),
          },
        ],
      },
    ],
  },

  // Protected User Routes
  {
    path: "/user",
    element: <UserProtectedRoute />,
    children: [
      {
        element: withSuspense(<LazyPublicLayout />),
        children: [
          {
            index: true,
            element: <Navigate to="/user/my-profile" replace />,
          },
          {
            path: "checkout",
            element: withSuspense(<Checkout />),
          },
          {
            path: "order-success/:orderId",
            element: withSuspense(<OrderSuccess />),
          },
          {
            path: "my-orders",
            element: withSuspense(<MyOrders />),
          },
          {
            path: "orders/:orderId",
            element: withSuspense(<UserOrderDetails />),
          },
          {
            path: "my-profile",
            element: withSuspense(<MyProfile />),
          },
        ],
      },
    ],
  },

  // Protected Admin Routes
  {
    path: "/admin",
    element: <AdminProtectedRoute />,
    children: [
      {
        element: withSuspense(<LazyAdminLayout />),
        children: [
          {
            index: true,
            element: <Navigate to="/admin/dashboard" replace />,
          },

          // Dashboard
          {
            path: "dashboard",
            element: withSuspense(<Dashboard />),
          },

          // Admin Chat
          {
            path: "chat",
            element: withSuspense(<AdminChatPage />),
          },

          // Orders
          {
            path: "orders",
            element: withSuspense(<AdminOrders />),
          },
          {
            path: "orders/:orderId",
            element: withSuspense(<AdminOrderDetails />),
          },

          // Products
          {
            path: "products",
            element: withSuspense(<Products />),
          },
          {
            path: "add-new-product",
            element: withSuspense(<ProductForm />),
          },
          {
            path: "edit-product/:slug",
            element: withSuspense(<EditProduct />),
          },

          // Categories
          {
            path: "categories",
            element: withSuspense(<AdminCategories />),
          },
          {
            path: "sub-categories",
            element: withSuspense(<SubCategories />),
          },
          {
            path: "child-categories",
            element: withSuspense(<ChildCategories />),
          },
          {
            path: "add",
            element: withSuspense(<AdditionalForm />),
          },
          {
            path: "child-category",
            element: withSuspense(<ChildCategoryForm />),
          },
          {
            path: "edit-category/:slug",
            element: withSuspense(<EditCategory />),
          },
          {
            path: "edit-sub-category/:slug",
            element: withSuspense(<EditSubCategory />),
          },
          {
            path: "edit-child-category/:slug",
            element: withSuspense(<EditChildCategory />),
          },

          // Brands
          {
            path: "brands",
            element: withSuspense(<Brands />),
          },
          {
            path: "edit-brand/:slug",
            element: withSuspense(<EditBrand />),
          },

          // Customers
          {
            path: "customers",
            element: withSuspense(<Customers />),
          },

          // Website Settings
          {
            path: "website/general",
            element: withSuspense(<WebsiteGeneral />),
          },
          {
            path: "website/hero-banners",
            element: withSuspense(<HeroBanner />),
          },
          {
            path: "website/offer-banners",
            element: withSuspense(<OfferBanner />),
          },
          {
            path: "website/about",
            element: withSuspense(<WebsiteAbout />),
          },
          {
            path: "website/contact",
            element: withSuspense(<WebsiteContact />),
          },
          {
            path: "website/social",
            element: withSuspense(<Social />),
          },
          {
            path: "website/footer",
            element: withSuspense(<Footer />),
          },
          {
            path: "website/seo",
            element: withSuspense(<Seo />),
          },

          // Existing Admin About Route
          {
            path: "about",
            element: withSuspense(<About />),
          },
        ],
      },
    ],
  },

  // Unknown Routes
  {
    path: "*",
    element: withSuspense(<NotFound />),
  },
]);
