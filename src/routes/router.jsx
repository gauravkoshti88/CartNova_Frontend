import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import { lazy, Suspense } from "react";
import PublicLayout from "../layouts/user/PublicLayout";
import { Loader } from "../components/States";
import AdminLayout from "../layouts/admin/AdminLayout";
import {
  AdminProtectedRoute,
  AdminPublicRoute,
  UserProtectedRoute,
} from "./ProtectedRoute";

const lazyLoad = (loader) => {
  const Comp = lazy(loader);
  return (
    <Suspense fallback={<Loader fullPage />}>
      <Comp />
    </Suspense>
  );
};

// AUTH Pages
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword.jsx"));

// Public Pages
const Home = lazy(() => import("../pages/public/Home"));
const Shop = lazy(() => import("../pages/public/Shop"));
const PublicCategories = lazy(() => import("../pages/public/Categories.jsx"));
const CategoryProducts = lazy(
  () => import("../pages/public/CategoryProducts.jsx"),
);
const ProdcutDetails = lazy(() => import("../pages/public/ProductDetails"));
const PublicOffers = lazy(() => import("../pages/public/Offers"));
const NewArrivals = lazy(() => import("../pages/public/NewArrivals"));
const BestSeller = lazy(() => import("../pages/public/BestSellers"));
const PublicAbout = lazy(() => import("../pages/public/About"));
const PublicContact = lazy(() => import("../pages/public/Contact"));
const Cart = lazy(() => import("../pages/public/Cart.jsx"));
const Wishlist = lazy(() => import("../pages/public/Wishlist.jsx"));

// Page Not Found
const NotFound = lazy(() => import("../pages/NotFound.jsx"));

// User Pages
const Checkout = lazy(() => import("../pages/user/Checkout.jsx"));
const MyProfile = lazy(() => import("../pages/user/MyProfile.jsx"));
const OrderSuccess = lazy(() => import("../pages/user/OrderSuccess.jsx"));
const MyOrders = lazy(() => import("../pages/user/MyOrders.jsx"));

// Auth Pages
const AuthPages = lazy(() => import("../pages/auth/AuthPage"));

// Admin Pages
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const AdminChatPage = lazy(() => import("../pages/admin/AdminChatPage.jsx"));
const AdminOrders = lazy(() => import("../pages/admin/Orders.jsx"));
const OrderDetails = lazy(() => import("../pages/admin/AdminOrderDetails.jsx"));
const Products = lazy(() => import("../pages/admin/Products"));
const Categories = lazy(() => import("../pages/admin/Categories"));
const SubCategories = lazy(() => import("../pages/admin/SubCategories"));
const ChildCategories = lazy(() => import("../pages/admin/ChildCategories"));
const Brands = lazy(() => import("../pages/admin/Brands"));
const Customers = lazy(() => import("../pages/admin/Customers"));
const AddNew = lazy(() => import("../components/admin_comp/AdditionalForm"));
const ChildCategoryForm = lazy(
  () => import("../components/admin_comp/ChildCategoryForm.jsx"),
);
const EditCategory = lazy(
  () => import("../components/admin_comp/EditCategory"),
);
const EditSubCategory = lazy(
  () => import("../components/admin_comp/EditSubCategory"),
);
const EditChildCategory = lazy(
  () => import("../components/admin_comp/EditChildCategory.jsx"),
);
const EditBrand = lazy(() => import("../components/admin_comp/EditBrand"));
const AddNewProduct = lazy(
  () => import("../components/admin_comp/ProductForm.jsx"),
);
const EditProductInfo = lazy(
  () => import("../components/admin_comp/EditProduct"),
);

// Website Pages

const General = lazy(() => import("../pages/admin/website/General"));
const HeroBanner = lazy(() => import("../pages/admin/website/HeroBanner"));
const OfferBanner = lazy(() => import("../pages/admin/website/OfferBanner"));
const About = lazy(() => import("../pages/admin/website/About"));
const Contact = lazy(() => import("../pages/admin/website/Contact"));
const Social = lazy(() => import("../pages/admin/website/Social"));
const Footer = lazy(() => import("../pages/admin/website/Footer"));
const Seo = lazy(() => import("../pages/admin/website/Seo"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: lazyLoad(() => import("../pages/public/Home")) },

      {
        path: "/shop",
        element: lazyLoad(() => import("../pages/public/Shop")),
      },

      {
        path: "/categories",
        element: lazyLoad(() => import("../pages/public/Categories.jsx")),
      },

      {
        path: "/categories/:slug",
        element: lazyLoad(() => import("../pages/public/CategoryProducts.jsx")),
      },

      {
        path: "/product/category/:categorySlug/:slug",
        element: lazyLoad(() => import("../pages/public/ProductDetails")),
      },

      {
        path: "/offers",
        element: lazyLoad(() => import("../pages/public/Offers")),
      },

      {
        path: "/new-arrivals",
        element: lazyLoad(() => import("../pages/public/NewArrivals")),
      },

      {
        path: "/best-sellers",
        element: lazyLoad(() => import("../pages/public/BestSellers")),
      },

      {
        path: "/about",
        element: lazyLoad(() => import("../pages/public/About")),
      },

      {
        path: "/contact",
        element: lazyLoad(() => import("../pages/public/Contact")),
      },

      {
        path: "/cart",
        element: lazyLoad(() => import("../pages/public/Cart.jsx")),
      },

      {
        path: "/wishlist",
        element: lazyLoad(() => import("../pages/public/Wishlist.jsx")),
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/register",
        element: lazyLoad(() =>
          import("../pages/auth/AuthPage").then((m) => ({
            default: m.Register,
          })),
        ),
      },

      {
        path: "/login",
        element: lazyLoad(() =>
          import("../pages/auth/AuthPage").then((m) => ({ default: m.Login })),
        ),
      },

      {
        path: "/forgot-password",
        element: lazyLoad(() => import("../pages/auth/ForgotPassword.jsx")),
      },

      {
        path: "/admin/login",
        element: lazyLoad(() =>
          import("../pages/auth/AuthPage").then((m) => ({
            default: m.AdminLogin,
          })),
        ),
      },
    ],
  },
  {
    path: "/user",
    element: <UserProtectedRoute />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          {
            index: true,
            element: lazyLoad(() => import("../pages/public/Home")),
          },
          {
            path: "checkout",
            element: lazyLoad(() => import("../pages/user/Checkout.jsx")),
          },
          {
            path: "order-success/:orderId",
            element: lazyLoad(() => import("../pages/user/OrderSuccess.jsx")),
          },
          {
            path: "my-orders",
            element: lazyLoad(() => import("../pages/user/MyOrders.jsx")),
          },
          {
            path: "orders/:orderId",
            element: lazyLoad(() => import("../pages/user/OrderDetails.jsx")),
          },
          {
            path: "my-profile",
            element: lazyLoad(() => import("../pages/user/MyProfile.jsx")),
          },
        ],
      },
    ],
  },
  {
    element: <AdminPublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/admin/login",
            element: lazyLoad(() =>
              import("../pages/auth/AuthPage").then((m) => ({
                default: m.AdminLogin,
              })),
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: lazyLoad(() => import("../pages/admin/Dashboard")),
          },

          {
            path: "about",
            element: lazyLoad(() => import("../pages/public/About")),
          },

          {
            path: "chat",
            element: lazyLoad(() => import("../pages/admin/AdminChatPage.jsx")),
          },

          {
            path: "orders",
            element: lazyLoad(() => import("../pages/admin/Orders.jsx")),
          },

          {
            path: "orders/:orderId",
            element: lazyLoad(
              () => import("../pages/admin/AdminOrderDetails.jsx"),
            ),
          },

          {
            path: "products",
            element: lazyLoad(() => import("../pages/admin/Products")),
          },

          {
            path: "categories",
            element: lazyLoad(() => import("../pages/admin/Categories")),
          },

          {
            path: "sub-categories",
            element: lazyLoad(() => import("../pages/admin/SubCategories")),
          },

          {
            path: "child-categories",
            element: lazyLoad(
              () => import("../pages/admin/ChildCategories.jsx"),
            ),
          },

          {
            path: "brands",
            element: lazyLoad(() => import("../pages/admin/Brands")),
          },

          {
            path: "customers",
            element: lazyLoad(() => import("../pages/admin/Customers")),
          },

          // Website CMS

          {
            path: "website/general",
            element: lazyLoad(() => import("../pages/admin/website/General")),
          },

          {
            path: "website/hero-banners",
            element: lazyLoad(
              () => import("../pages/admin/website/HeroBanner"),
            ),
          },

          {
            path: "website/offer-banners",
            element: lazyLoad(
              () => import("../pages/admin/website/OfferBanner"),
            ),
          },

          {
            path: "website/about",
            element: lazyLoad(() => import("../pages/admin/website/About")),
          },

          {
            path: "website/contact",
            element: lazyLoad(() => import("../pages/admin/website/Contact")),
          },

          {
            path: "website/social",
            element: lazyLoad(() => import("../pages/admin/website/Social")),
          },

          {
            path: "website/footer",
            element: lazyLoad(() => import("../pages/admin/website/Footer")),
          },

          {
            path: "website/seo",
            element: lazyLoad(() => import("../pages/admin/website/Seo")),
          },

          // Existing
          {
            path: "add",
            element: lazyLoad(
              () => import("../components/admin_comp/AdditionalForm"),
            ),
          },
          {
            path: "child-category",
            element: lazyLoad(
              () => import("../components/admin_comp/ChildCategoryForm.jsx"),
            ),
          },
          {
            path: "edit-category/:slug",
            element: lazyLoad(
              () => import("../components/admin_comp/EditCategory"),
            ),
          },

          {
            path: "edit-sub-category/:slug",
            element: lazyLoad(
              () => import("../components/admin_comp/EditSubCategory"),
            ),
          },
          {
            path: "edit-child-category/:slug",
            element: lazyLoad(
              () => import("../components/admin_comp/EditChildCategory.jsx"),
            ),
          },

          {
            path: "edit-brand/:slug",
            element: lazyLoad(
              () => import("../components/admin_comp/EditBrand"),
            ),
          },

          {
            path: "add-new-product",
            element: lazyLoad(
              () => import("../components/admin_comp/ProductForm.jsx"),
            ),
          },

          {
            path: "edit-product/:slug",
            element: lazyLoad(
              () => import("../components/admin_comp/EditProduct"),
            ),
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: lazyLoad(() => import("../pages/NotFound.jsx")),
  },
]);
