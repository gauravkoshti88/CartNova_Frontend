import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const routeConfig = {
  "/shop": {
    title: "Shop",
    description: "Browse all our premium products.",
  },

  "/new-arrivals": {
    title: "New-Arrivals",
    description: "Discover the latest products just added to our store.",
  },

  "/best-sellers": {
    title: "Best-Sellers",
    description: "Explore our most popular and top-rated products.",
  },

  "/offers": {
    title: "Offers",
    description: "Save more with exclusive deals and limited-time discounts.",
  },

  "/categories": {
    title: "Categories",
    description: "Explore products by category.",
  },

  "/brands": {
    title: "Brands",
    description: "Shop your favourite brands.",
  },

  "/wishlist": {
    title: "Wishlist",
    description: "Products you've saved.",
  },

  "/cart": {
    title: "Shopping Cart",
    description: "Review your cart items.",
  },

  "/user/checkout": {
    title: "Checkout",
    description: "Complete your purchase securely.",
  },

  "/user/my-profile": {
    title: "My Profile",
    description: "Manage your account settings and personal information.",
  },

  "/user/my-orders": {
    title: "My Orders",
    description: "Track your orders and view purchase history.",
  },

  "/about": {
    title: "About",
    description:
      "Learn more about our story, mission, and commitment to quality.",
  },

  "/contact": {
    title: "Contact Us",
    description: "We're here to help. Reach out to our support team anytime.",
  },
};

export default function Breadcrumb() {
  const { pathname } = useLocation();

  const current = routeConfig[pathname];

  if (!current || pathname === "/") return null;

  return (
    <section className="bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-5 py-5">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link
            to="/"
            className="flex items-center gap-1 dark:text-gray-400 hover:text-emerald-600"
          >
            <Home size={16} />
            Home
          </Link>

          <ChevronRight size={16} />

          <span className="font-medium text-black dark:text-white">
            {current.title}
          </span>
        </div>
      </div>
    </section>
  );
}

export const CategoryBreadcrumb = ({
  category,
  categorySlug,

  subCategory,
  subCategorySlug,

  childCategory,
  childCategorySlug,

  product,
  productSlug,
}) => {
  const categoryName = category?.name || categorySlug;
  const subCategoryName = subCategory?.name || subCategorySlug;
  const childCategoryName = childCategory?.name || childCategorySlug;
  const productName = product?.name || productSlug;

  const categorySlugValue = categorySlug || category?.slug;
  const subCategorySlugValue = subCategorySlug || subCategory?.slug;
  const childCategorySlugValue = childCategorySlug || childCategory?.slug;

  const formatName = (name) => {
    if (!name) return "";

    return String(name)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const normalClass = `
    text-slate-400
    dark:text-slate-400
    transition-colors
    hover:text-slate-700
    dark:hover:text-slate-300
  `;

  const activeClass = `
    font-semibold
    text-slate-900
    dark:text-white
  `;

  /*
  |--------------------------------------------------------------------------
  | CATEGORY URL
  |--------------------------------------------------------------------------
  */

  const categoryPath = categorySlugValue
    ? `/categories/${categorySlugValue}`
    : "/categories";

  /*
  |--------------------------------------------------------------------------
  | SUB CATEGORY URL
  |--------------------------------------------------------------------------
  */

  const subCategoryPath =
    categorySlugValue && subCategorySlugValue
      ? `/categories/${categorySlugValue}?subcategory=${encodeURIComponent(
          subCategorySlugValue,
        )}`
      : categoryPath;

  /*
  |--------------------------------------------------------------------------
  | CHILD CATEGORY URL
  |--------------------------------------------------------------------------
  */

  const childCategoryPath =
    categorySlugValue && subCategorySlugValue && childCategorySlugValue
      ? `/categories/${categorySlugValue}?subcategory=${encodeURIComponent(
          subCategorySlugValue,
        )}&childcategory=${encodeURIComponent(childCategorySlugValue)}`
      : subCategoryPath;

  return (
    <nav
      aria-label="Breadcrumb"
      className="
        mb-5
        flex
        w-full
        max-w-7xl mx-auto px-5 py-5
        items-center
        overflow-x-auto
        whitespace-nowrap
        scrollbar-hide
        bg-gray-50
        dark:bg-slate-900
      "
    >
      <ol className="flex items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
        {/* =====================================================
            HOME
        ===================================================== */}

        <li className="flex shrink-0 items-center">
          <Link to="/" className={normalClass}>
            <span className="flex items-center gap-1">
              <Home size={14} />
              Home
            </span>
          </Link>
        </li>

        <ChevronRight
          size={14}
          className="shrink-0 text-slate-300 dark:text-slate-600"
        />

        {/* =====================================================
            CATEGORIES
        ===================================================== */}

        <li className="flex shrink-0 items-center">
          <Link to="/categories" className={normalClass}>
            Categories
          </Link>
        </li>

        {/* =====================================================
            CATEGORY
        ===================================================== */}

        {categoryName && (
          <>
            <ChevronRight
              size={14}
              className="shrink-0 text-slate-300 dark:text-slate-600"
            />

            <li className="flex shrink-0 items-center">
              <Link
                to={categoryPath}
                className={
                  !subCategoryName && !childCategoryName && !productName
                    ? activeClass
                    : normalClass
                }
              >
                {formatName(categoryName)}
              </Link>
            </li>
          </>
        )}

        {/* =====================================================
            SUB CATEGORY
        ===================================================== */}

        {subCategoryName && (
          <>
            <ChevronRight
              size={14}
              className="shrink-0 text-slate-300 dark:text-slate-600"
            />

            <li className="flex shrink-0 items-center">
              <Link
                to={subCategoryPath}
                className={
                  !childCategoryName && !productName ? activeClass : normalClass
                }
              >
                {formatName(subCategoryName)}
              </Link>
            </li>
          </>
        )}

        {/* =====================================================
            CHILD CATEGORY
        ===================================================== */}

        {childCategoryName && (
          <>
            <ChevronRight
              size={14}
              className="shrink-0 text-slate-300 dark:text-slate-600"
            />

            <li className="flex shrink-0 items-center">
              <Link
                to={childCategoryPath}
                className={!productName ? activeClass : normalClass}
              >
                {formatName(childCategoryName)}
              </Link>
            </li>
          </>
        )}

        {/* =====================================================
            PRODUCT
        ===================================================== */}

        {productName && (
          <>
            <ChevronRight
              size={14}
              className="shrink-0 text-slate-300 dark:text-slate-600"
            />

            <li
              className="
                max-w-[180px]
                truncate
                font-semibold
                text-slate-900
                dark:text-white
                sm:max-w-[280px]
              "
            >
              {formatName(productName)}
            </li>
          </>
        )}
      </ol>
    </nav>
  );
};
