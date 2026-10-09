import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Home, ShoppingBag } from "lucide-react";
import { getCategories } from "../../redux/thunks/publicCategoryThunk";

export default function BottomNavbar() {
  const dispatch = useDispatch();

  const { categories = [], categoriesLoading } = useSelector(
    (state) => state.publicCategory,
  );

  const [showIcons, setShowIcons] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!categories.length) {
      dispatch(getCategories());
    }
  }, [dispatch, categories.length]);

  // ================================
  // SCROLL DETECTION
  // ================================
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 5) {
        setShowIcons(true);
      } else {
        setShowIcons(false);
      }
    };

    // Initial state
    setShowIcons(window.scrollY <= 5);

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navClass = ({ isActive }) =>
    `
      group
      flex
      shrink-0
      flex-col
      items-center
      justify-center
      gap-1
      whitespace-nowrap
      transition-all
      duration-300
      ${
        isActive
          ? "font-semibold text-orange-500"
          : "text-gray-700 dark:text-gray-300"
      }
      hover:text-orange-500
    `;

  const iconClass = `
    transition-all
    duration-300
    ease-in-out
    overflow-hidden
    ${
      showIcons
        ? "h-8 w-8 md:h-12 md:w-12 opacity-100 scale-100"
        : "h-0 w-0 opacity-0 scale-75"
    }
  `;

  return (
    <nav
      className="
        fixed
        top-16
        left-0
        right-0
        z-30
        border-t
        border-b
        border-gray-200
        bg-white
        dark:border-gray-700
        dark:bg-gray-900
      "
    >
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-7xl
          items-center
          gap-5
          overflow-x-auto
          px-4
          py-2
          scrollbar-hide
          md:gap-6
        "
      >
        {/* =========================
            FOR YOU
        ========================= */}
        <NavLink to="/" className={navClass}>
          <div
            className={`
              flex
              items-center
              justify-center
              rounded-xl
              bg-gray-100
              dark:bg-gray-800
              ${iconClass}
            `}
          >
            <Home className="h-6 w-6 md:h-9 md:w-9" color="blue" />
          </div>

          <span
            className={`${!showIcons ? "text-[14px]" : "text-[12px] sm:text-xs"}`}
          >
            For You
          </span>
        </NavLink>

        {/* =========================
            SHOP
        ========================= */}
        <NavLink to="/shop" className={navClass}>
          <div
            className={`
              flex
              items-center
              justify-center
              rounded-xl
              bg-gray-100
              dark:bg-gray-800
              ${iconClass}
            `}
          >
            <ShoppingBag className="h-6 w-6 md:h-9 md:w-9" color="blue" />
          </div>

          <span
            className={`${!showIcons ? "text-[14px]" : "text-[12px] sm:text-xs"}`}
          >
            Shop
          </span>
        </NavLink>

        {/* =========================
            CATEGORIES
        ========================= */}
        {!categoriesLoading && (
          <div className="flex items-center gap-5 md:gap-6">
            {categories.map((category) => (
              <NavLink
                key={category._id}
                to={`/categories/${category.slug}`}
                className={navClass}
              >
                {/* Category Icon */}
                <div
                  className={`
                    flex
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-xl
                    bg-gray-100
                    dark:bg-gray-800
                    ${iconClass}
                  `}
                >
                  {category?.image?.url ? (
                    <img
                      src={category.image.url}
                      alt={category.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                      {category?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Category Name */}
                <span
                  className={`max-w-20 truncate ${!showIcons ? "text-[14px]" : "text-[12px] sm:text-xs"}`}
                >
                  {category.name}
                </span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
