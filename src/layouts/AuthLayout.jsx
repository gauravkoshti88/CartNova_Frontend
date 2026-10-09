import React from "react";
import UserBanner from "../assets/user-auth-banner.png";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Logo } from "../components/Logo";
import { Loader } from "../components/States";

const pageContent = {
  "/login": {
    title: "Welcome Back",
    description:
      "Sign in to your CartNova account to continue shopping, track your orders, and enjoy exclusive deals.",
    features: [
      "Access your saved wishlist",
      "Track your recent orders",
      "Secure & encrypted login",
      "Exclusive member discounts",
      "24/7 customer support",
      "Fast & reliable delivery",
      "Trusted by thousands of shoppers",
    ],
  },

  "/register": {
    title: "Create Your Account",
    description:
      "Join CartNova today and discover premium products, exclusive offers, and a seamless shopping experience.",
    features: [
      "Quick & easy registration",
      "Exclusive welcome offers",
      "Wide range of categories",
      "Secure checkout",
      "Fast delivery",
      "Easy returns & refunds",
      "24/7 customer support",
    ],
  },

  "/admin/login": {
    title: "Admin Portal",
    description:
      "Securely access the CartNova administration dashboard to manage products, orders, and customers.",
    features: [
      "Manage products & inventory",
      "Track customer orders",
      "Analytics dashboard",
      "Role-based access",
      "Secure authentication",
      "Manage users",
      "System monitoring",
    ],
  },
};

const AuthLayout = () => {
  const { pathname } = useLocation();
  const content = pageContent[pathname] || pageContent["/login"];
  const { loading } = useSelector((state) => state.website);
  const firstColumn = content.features.slice(
    0,
    Math.ceil(content.features.length / 2),
  );

  const secondColumn = content.features.slice(
    Math.ceil(content.features.length / 2),
  );

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="min-h-screen flex justify-center bg-white overflow-hidden">
      <div className="hidden lg:block w-full h-full relative">
        <div className="absolute z-50 top-2 left-2">
          <Logo />
        </div>
        {/* Image */}
        <img
          src={UserBanner}
          alt=""
          className="w-full h-screen object-cover rounded-br-[15%] rounded-tr-[15%]"
        />

        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black/80 rounded-br-[15%] rounded-tr-[15%]"></div>

        {/* Overlay Content */}
        <div className="absolute left-20 top-1/3 w-full max-w-lg text-white space-y-6">
          <h1 className="text-5xl font-display font-bold drop-shadow-lg">
            {content.title}
          </h1>
          <p className="text-lg font-sans leading-relaxed drop-shadow-md">
            {content.description}
          </p>
          <ul className="space-y-2 text-sm font-sans flex">
            <div className="space-y-3">
              {firstColumn.map((list, index) => (
                <li className="flex items-center gap-2" key={index}>
                  <span className="w-2 h-2 bg-color-accent-500 rounded-full"></span>
                  {list}
                </li>
              ))}
            </div>

            <div className="space-y-3">
              {secondColumn.map((list, index) => (
                <li className="flex items-center gap-2" key={index}>
                  <span className="w-2 h-2 bg-color-accent-500 rounded-full"></span>
                  {list}
                </li>
              ))}
            </div>
          </ul>
        </div>
      </div>

      <div className="w-full h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
