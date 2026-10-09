import { AnimatePresence, motion } from "framer-motion";
import { X, User, Search, ChevronRight, LogIn, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import ThemeButton from "../ThemeButton";
import { navLinks, quickLinks, moreLinks } from "./navData";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/thunks/userAuthThunk";
import { disconnectChatSocket } from "../../utils/chatSocket";

/* ===========================
   Reusable Menu Item
=========================== */

const MenuItem = ({ title, path, icon: Icon, closeSidebar }) => {
  return (
    <Link
      to={path}
      onClick={closeSidebar}
      className="
        group flex w-full items-center justify-between
        rounded-xl
        px-3 py-2.5
        text-gray-700
        transition-all duration-200
        hover:bg-gray-100
        sm:py-3
        dark:text-gray-200
        dark:hover:bg-slate-800
      "
    >
      <div className="flex min-w-0 items-center gap-3">
        <Icon
          className="
            h-[18px] w-[18px] shrink-0
            text-gray-500
            transition-colors
            group-hover:text-orange-500
            sm:h-5 sm:w-5
            dark:text-gray-400
          "
        />

        <span className="truncate text-xs font-medium sm:text-sm">{title}</span>
      </div>

      <ChevronRight
        className="
          h-4 w-4 shrink-0
          text-gray-400
          transition-transform
          group-hover:translate-x-0.5
        "
      />
    </Link>
  );
};

/* ===========================
   Section Title
=========================== */

const SectionTitle = ({ children }) => {
  return (
    <h4
      className="
      mb-2 px-3
      text-[10px]
      font-semibold
      uppercase
      tracking-wider
      text-gray-400
      sm:text-xs
    "
    >
      {children}
    </h4>
  );
};

/* ===========================
   Mobile Sidebar
=========================== */

export default function MobileSidebar({ isOpen, closeSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.userAuth);

  const handleLogout = async () => {
    try {
      // Disconnect chat socket immediately
      disconnectChatSocket();

      // Logout backend
      await dispatch(logoutUser()).unwrap();

      // Redirect
      navigate("/");
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ===========================
              Overlay
          =========================== */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeSidebar}
            className="
              fixed inset-0 z-40
              bg-black/50
              backdrop-blur-sm
              lg:hidden
            "
          />

          {/* ===========================
              Drawer
          =========================== */}

          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 28,
            }}
            className="
    fixed left-0 top-0 z-50
    flex h-screen flex-col
    w-[82%] max-w-[340px]
    bg-white shadow-2xl
    dark:bg-slate-900
    lg:hidden
  "
          >
            {/* ===========================
      Fixed Header
  =========================== */}

            <div
              className="
      flex shrink-0
      items-center justify-between
      border-b border-gray-200
      bg-white
      px-4 py-4
      sm:px-5
      dark:border-slate-700
      dark:bg-slate-900
    "
            >
              <h2
                className="
        text-base font-semibold
        text-gray-900
        sm:text-lg
        dark:text-white
      "
              >
                Menu
              </h2>

              <button
                type="button"
                onClick={closeSidebar}
                aria-label="Close menu"
                className="
        rounded-lg p-2
        text-gray-600
        transition
        hover:bg-gray-100
        dark:text-gray-300
        dark:hover:bg-slate-800
      "
              >
                <X className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
              </button>
            </div>

            {/* ===========================
      Scrollable Content
  =========================== */}

            <div className="min-h-0 flex-1 overflow-y-auto hide-scrollbar">
              {/* User / Login */}
              <div
                className="
        border-b border-gray-200
        px-4 py-4
        sm:px-5 sm:py-5
        dark:border-slate-700
      "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
            flex h-11 w-11 shrink-0
            items-center justify-center
            rounded-full
            bg-gray-100
            sm:h-12 sm:w-12
            dark:bg-slate-800
            ring-2 ring-gray-400
          "
                  >
                    {user?.profileImage?.url ? (
                      <img
                        src={user?.profileImage?.url}
                        alt={user?.profileImage?.alt || "profile"}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 sm:h-6 sm:w-6" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3
                      className="
              truncate
              text-sm font-semibold
              text-gray-900
              sm:text-base
              dark:text-white
            "
                    >
                      {!isAuthenticated
                        ? "Hello, Guest 👋"
                        : `${user?.firstName} ${user?.lastName}`}
                    </h3>

                    <p
                      className="
              mt-0.5
              text-[11px]
              text-gray-500
              sm:text-xs
              dark:text-gray-400
            "
                    >
                      {!isAuthenticated
                        ? "Login to access your account"
                        : user.email}
                    </p>
                  </div>
                </div>

                {!isAuthenticated && (
                  <Link
                    to="/login"
                    onClick={closeSidebar}
                    className="
          mt-4
          flex items-center justify-center gap-2
          rounded-xl
          bg-orange-500
          py-2.5
          text-xs font-medium text-white
          transition hover:bg-orange-600
          sm:py-3 sm:text-sm
        "
                  >
                    <LogIn className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                    Login
                  </Link>
                )}
              </div>

              {/* Account */}
              <div className="border-t border-gray-200 px-4 py-4 sm:px-5 dark:border-slate-700">
                <SectionTitle>Account</SectionTitle>

                <div className="space-y-1">
                  {quickLinks.map((item) => (
                    <MenuItem
                      key={item.path}
                      {...item}
                      closeSidebar={closeSidebar}
                    />
                  ))}
                </div>
              </div>

              {/* Main Menu */}
              <div className="border-t border-gray-200 px-4 py-4 sm:px-5 dark:border-slate-700">
                <SectionTitle>Main Menu</SectionTitle>

                <div className="space-y-1">
                  {navLinks.map((item) => (
                    <MenuItem
                      key={item.path}
                      {...item}
                      closeSidebar={closeSidebar}
                    />
                  ))}
                </div>
              </div>

              {/* More */}
              <div className="border-t border-gray-200 px-4 py-4 sm:px-5 dark:border-slate-700">
                <SectionTitle>More</SectionTitle>

                <div className="space-y-1">
                  {moreLinks.map((item) => (
                    <MenuItem
                      key={item.path}
                      {...item}
                      closeSidebar={closeSidebar}
                    />
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div
                className="
        flex items-center justify-between
        border-t border-gray-200
        px-4 py-4
        sm:px-5
        dark:border-slate-700
      "
              >
                <span className="text-xs font-medium sm:text-sm dark:text-white">
                  Dark Mode
                </span>

                <ThemeButton />
              </div>

              {/* Logout */}
              {isAuthenticated && (
                <div className="border-t border-gray-200 p-4 sm:p-5 dark:border-slate-700">
                  <button
                    type="button"
                    className="
          flex w-full
          items-center justify-center gap-2
          rounded-xl
          bg-red-500
          py-2.5
          text-xs font-medium text-white
          transition hover:bg-red-600
          sm:py-3 sm:text-sm
        "
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
