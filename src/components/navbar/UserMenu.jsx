import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  User,
  ChevronDown,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  LogIn,
} from "lucide-react";

export default function UserMenu({
  isAuthenticated = false,
  user = null,
  onLogout,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative hidden md:block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger */}
      <button className="flex items-center gap-2 px-3 py-2 transition">
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-orange-500 text-white font-semibold ring-2 ring-green-400">
          {isAuthenticated ? (
            user?.profileImage?.url ? (
              <img
                src={user.profileImage.url}
                alt={user?.firstName || "Profile"}
                className="h-full w-full object-cover"
              />
            ) : (
              user?.firstName?.charAt(0)?.toUpperCase() || "U"
            )
          ) : (
            <User size={18} />
          )}
        </div>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-72 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden z-50"
          >
            {isAuthenticated ? (
              <>
                {/* Header */}
                <div className="border-b border-gray-200 dark:border-slate-700 p-5">
                  <div className="flex items-center gap-3">
                    {/* Profile Image */}
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold ring-2 ring-green-400">
                      {user?.profileImage?.url ? (
                        <img
                          src={user.profileImage.url}
                          alt={user?.profileImage?.alt || "Profile"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        user?.firstName?.charAt(0)?.toUpperCase() || "U"
                      )}
                    </div>

                    {/* User Info */}
                    <div className="min-w-0">
                      <h3 className="font-semibold text-lg truncate dark:text-gray-300">
                        {user?.firstName} {user?.lastName}
                      </h3>

                      <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu */}
                <div className="py-2">
                  <Link
                    to="/user/my-profile"
                    className="flex items-center gap-3 px-5 py-3 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                  >
                    <User size={18} />
                    My Profile
                  </Link>

                  <Link
                    to="/user/my-orders"
                    className="flex items-center gap-3 px-5 py-3 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                  >
                    <Package size={18} />
                    My Orders
                  </Link>

                  <Link
                    to="/wishlist"
                    className="flex items-center gap-3 px-5 py-3 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                  >
                    <Heart size={18} />
                    Wishlist
                  </Link>

                  <Link
                    to="/user/settings"
                    className="flex items-center gap-3 px-5 py-3 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                  >
                    <Settings size={18} />
                    Settings
                  </Link>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-200 dark:border-slate-700 p-3">
                  <button
                    onClick={onLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-white hover:bg-red-600 transition"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="p-5 border-b border-gray-200 dark:border-slate-700">
                  <h3 className="font-semibold text-lg">Welcome to CartNova</h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Login to access your orders, wishlist and more.
                  </p>

                  <Link
                    to="/login"
                    className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-white hover:bg-orange-600 transition"
                  >
                    <LogIn size={18} />
                    Login
                  </Link>
                </div>

                <div className="py-2">
                  <Link
                    to="/register"
                    className="block px-5 py-3 hover:bg-gray-100 dark:hover:bg-slate-800"
                  >
                    Create Account
                  </Link>

                  <Link
                    to="/wishlist"
                    className="block px-5 py-3 hover:bg-gray-100 dark:hover:bg-slate-800"
                  >
                    Wishlist
                  </Link>

                  <Link
                    to="/contact"
                    className="block px-5 py-3 hover:bg-gray-100 dark:hover:bg-slate-800"
                  >
                    Help Center
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
