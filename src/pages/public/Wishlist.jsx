import { useEffect, useState } from "react";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import ProductCard from "../../components/Product/ProductCard";
import useWishlist from "../../hooks/useWishlist";
import publicService from "../../services/publicService";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { Heading } from "../../components/Heading";
import Breadcrumb from "../../components/Breadcrumb";
import { Loader } from "../../components/States";

export default function Wishlist() {
  useDocumentTitle("Wishlist");

  const { products, loading, removeItem, clear } = useWishlist();

  const { isAuthenticated } = useSelector((state) => state.userAuth);

  const [guestProducts, setGuestProducts] = useState([]);
  const [guestLoading, setGuestLoading] = useState(false);

  // =========================================================
  // LOAD GUEST WISHLIST PRODUCTS
  // =========================================================

  useEffect(() => {
    if (isAuthenticated) {
      setGuestProducts([]);
      return;
    }

    let cancelled = false;

    const loadGuestProducts = async () => {
      try {
        setGuestLoading(true);

        const stored = JSON.parse(
          localStorage.getItem("gshop_guest_wishlist") || "[]",
        );

        if (!Array.isArray(stored) || !stored.length) {
          if (!cancelled) {
            setGuestProducts([]);
          }

          return;
        }

        const results = await Promise.all(
          stored.map(async (productId) => {
            try {
              if (!productId) {
                return null;
              }

              const response = await publicService.getProductById(productId);

              return (
                response?.data?.product || response?.data?.data?.product || null
              );
            } catch (error) {
              console.error(
                `Failed to fetch wishlist product ${productId}:`,
                error,
              );

              return null;
            }
          }),
        );

        if (!cancelled) {
          setGuestProducts(results.filter(Boolean));
        }
      } catch (error) {
        console.error("Failed to load guest wishlist:", error);

        if (!cancelled) {
          setGuestProducts([]);
        }
      } finally {
        if (!cancelled) {
          setGuestLoading(false);
        }
      }
    };

    loadGuestProducts();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  // =========================================================
  // DISPLAY PRODUCTS
  // =========================================================

  const wishlistProducts = isAuthenticated ? products : guestProducts;

  // =========================================================
  // REMOVE
  // =========================================================

  const handleRemove = async (productId) => {
    if (!productId) return;

    try {
      await removeItem(productId);

      if (!isAuthenticated) {
        setGuestProducts((prev) =>
          prev.filter(
            (product) => product?._id?.toString() !== productId?.toString(),
          ),
        );
      }

      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error(error?.message || "Failed to remove item from wishlist");
    }
  };

  // =========================================================
  // CLEAR
  // =========================================================

  const handleClear = async () => {
    try {
      await clear();

      if (!isAuthenticated) {
        setGuestProducts([]);
      }

      toast.success("Wishlist cleared");
    } catch (error) {
      toast.error(error?.message || "Failed to clear wishlist");
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  // if (loading || guestLoading) {
  //   return <Loader />;
  // }

  // =========================================================
  // EMPTY
  // =========================================================

  if (!wishlistProducts.length) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-5">
        <div
          className="
            flex
            min-h-[450px]
            flex-col
            items-center
            justify-center
            rounded-2xl
            border
            border-dashed
            border-gray-300
            bg-gray-50
            px-5
            text-center
            dark:border-slate-700
            dark:bg-slate-900
          "
        >
          <div
            className="
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-red-50
              dark:bg-red-950/30
            "
          >
            <Heart size={36} className="text-red-400" />
          </div>

          <h2
            className="
              mt-5
              text-xl
              font-semibold
              text-gray-900
              dark:text-white
            "
          >
            Your Wishlist is Empty
          </h2>

          <p
            className="
              mt-2
              max-w-md
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            Save products you love and find them here whenever you want.
          </p>

          <Link
            to="/shop"
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-orange-500
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-orange-600
            "
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  // =========================================================
  // WISHLIST
  // =========================================================

  return (
    <section className="w-full">
      <div
        className="
        mx-auto
        w-full
        max-w-7xl
        px-4
        py-1 md:py-5
        sm:px-6
        lg:px-5
      "
      >
        <Breadcrumb />
        <div className="mb-6 flex items-center justify-between gap-4 px-5 mt-5">
          {/* HEADER */}

          <Heading
            heading={"My Wishlist"}
            para={`${wishlistProducts.length}${" "}
            ${wishlistProducts.length === 1 ? "item" : "items"} saved`}
          />

          <button
            type="button"
            onClick={handleClear}
            className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-red-200
            px-3
            py-2
            text-xs
            font-semibold
            text-red-500
            transition
            hover:bg-red-50
            sm:px-4
            sm:py-2.5
            sm:text-sm
            dark:border-red-900
            dark:hover:bg-red-950/30
          "
          >
            <Trash2 size={16} />
            Clear All
          </button>
        </div>

        {/* PRODUCTS */}

        <div
          className="
          grid
          grid-cols-2
          gap-3
          sm:gap-4
          md:grid-cols-3
          lg:grid-cols-4
          xl:gap-5
        "
        >
          {wishlistProducts.map((product) => {
            if (!product?._id) {
              return null;
            }

            return (
              <div key={product._id} className="relative">
                <ProductCard product={product} />

                {/* REMOVE */}

                <button
                  type="button"
                  onClick={() => handleRemove(product._id)}
                  className="
                  absolute
                  right-3
                  top-3
                  z-20
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-red-500
                  shadow-md
                  transition
                  hover:scale-105
                  hover:bg-red-50
                  dark:bg-slate-900
                  dark:hover:bg-red-950/30
                "
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
