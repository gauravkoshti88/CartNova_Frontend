import { Heart, ShoppingCart, Menu, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Logo } from "../Logo";
import ThemeButton from "../ThemeButton";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

import useCart from "../../hooks/useCart";
import useGuestCart from "../../hooks/useGuestCart";
import useWishlist from "../../hooks/useWishlist";

import { logoutUser } from "../../redux/thunks/userAuthThunk";
import { getCart } from "../../redux/thunks/cartThunk";

import { useToast } from "../../hooks/useToast";
import { clearError, clearMessage } from "../../redux/slices/userAuthSlice";
import { disconnectChatSocket } from "../../utils/chatSocket";

export default function TopNavbar({ openSidebar }) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, success, message, error, isAuthenticated } = useSelector(
    (state) => state.userAuth,
  );

  // =====================================================
  // CART
  // =====================================================

  const cart = useCart();
  const guestCart = useGuestCart();

  const { totalItems: cartTotalItems = 0 } = cart;

  const { totalItems: guestCartTotalItems = 0 } = guestCart;

  // =====================================================
  // WISHLIST
  // =====================================================

  const { totalItems: wishlistCount = 0, fetchWishlist } = useWishlist();

  // =====================================================
  // AUTH TOAST
  // =====================================================

  useToast({
    success,
    message,
    error,
    clearMessage: () => dispatch(clearMessage()),
    clearError: () => dispatch(clearError()),
  });

  // =====================================================
  // CART COUNT
  // =====================================================

  const cartCount = isAuthenticated ? cartTotalItems : guestCartTotalItems;

  // =====================================================
  // INITIAL CART / WISHLIST FETCH
  // =====================================================

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    // Fetch cart immediately when user is authenticated
    dispatch(getCart())
      .unwrap()
      .catch(() => {});

    // Fetch wishlist
    fetchWishlist()?.catch(() => {});
  }, [dispatch, isAuthenticated, fetchWishlist]);

  // =====================================================
  // LOGOUT
  // =====================================================

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

  // =====================================================
  // MOBILE SEARCH SCROLL
  // =====================================================

  useEffect(() => {
    const handleScroll = () => {
      if (showMobileSearch) {
        setShowMobileSearch(false);
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showMobileSearch]);

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <header
        className="
          fixed
          left-0
          right-0
          top-0
          z-50
          border-b
          border-gray-200
          bg-gray-50
          dark:border-slate-800
          dark:bg-slate-950
        "
      >
        <div
          className="
            mx-auto
            flex
            h-16
            w-full
            max-w-7xl
            items-center
            justify-between
            gap-2
            px-2
          "
        >
          {/* =================================================
              LEFT
          ================================================= */}

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={openSidebar}
              className="
                flex
                items-center
                justify-center
                rounded-lg
                p-2
                transition
                hover:bg-gray-100
                dark:hover:bg-slate-800
                lg:hidden
              "
              aria-label="Open menu"
            >
              <Menu size={22} className="text-black dark:text-white" />
            </button>

            <Logo />
          </div>

          {/* =================================================
              DESKTOP SEARCH
          ================================================= */}

          <div className="hidden w-full lg:flex">
            <SearchBar />
          </div>

          {/* =================================================
              RIGHT
          ================================================= */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-0.5
              sm:gap-2
            "
          >
            {/* Theme */}

            <div className="hidden lg:block">
              <ThemeButton />
            </div>

            {/* Mobile Search */}

            <button
              type="button"
              onClick={() => setShowMobileSearch((prev) => !prev)}
              className="
                flex
                items-center
                justify-center
                rounded-lg
                p-2
                transition
                hover:bg-gray-100
                dark:hover:bg-slate-800
                lg:hidden
              "
              aria-label={showMobileSearch ? "Close search" : "Open search"}
            >
              <Search size={22} className="text-black dark:text-white" />
            </button>

            {/* =================================================
                WISHLIST
            ================================================= */}

            <Link
              to="/wishlist"
              className="
                relative
                rounded-lg
                p-2
                transition
                hover:bg-gray-100
                dark:hover:bg-slate-800
              "
            >
              <Heart size={22} className="text-black dark:text-white" />

              {wishlistCount > 0 && (
                <span
                  className="
                    absolute
                    -right-1
                    -top-1
                    flex
                    h-5
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-red-500
                    px-1
                    text-[10px]
                    font-medium
                    text-white
                  "
                >
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* =================================================
                CART
            ================================================= */}

            <Link
              to="/cart"
              className="
                relative
                rounded-lg
                p-2
                transition
                hover:bg-gray-100
                dark:hover:bg-slate-800
              "
            >
              <ShoppingCart size={22} className="text-black dark:text-white" />

              {cartCount > 0 && (
                <span
                  className="
                    absolute
                    -right-1
                    -top-1
                    flex
                    h-5
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-orange-500
                    px-1
                    text-[10px]
                    font-medium
                    text-white
                  "
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* =================================================
                USER
            ================================================= */}

            <UserMenu
              isAuthenticated={isAuthenticated}
              user={user}
              onLogout={handleLogout}
            />
          </div>
        </div>

        {/* =====================================================
            MOBILE SEARCH
        ===================================================== */}

        <div
          className={`
            overflow-hidden
            border-t
            border-gray-200
            bg-white
            transition-all
            duration-300
            ease-out
            dark:border-slate-800
            dark:bg-slate-950
            lg:hidden
            ${
              showMobileSearch
                ? "max-h-24 w-full opacity-100"
                : "max-h-0 opacity-0"
            }
          `}
        >
          <div
            className={`
              mx-auto
              w-full
              max-w-7xl
              px-4
              py-2
              transition-transform
              duration-300
              sm:px-6
              ${showMobileSearch ? "translate-y-0" : "-translate-y-3"}
            `}
          >
            <SearchBar />
          </div>
        </div>
      </header>
    </>
  );
}
