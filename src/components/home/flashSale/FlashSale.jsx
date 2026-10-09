import { Flame } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Countdown from "./Countdown";
import FlashSaleCard from "./FlashSaleCard";

import { getProductsOffer } from "../../../redux/thunks/publicProductThunk";

export default function FlashSale() {
  const dispatch = useDispatch();

  const {
    offerProducts = {},
    offerProductsLoading,
    offerProductsError,
  } = useSelector((state) => state.publicProduct);

  useEffect(() => {
    if (!offerProducts.length) {
      dispatch(getProductsOffer());
    }
  }, [dispatch, offerProducts.length]);

  return (
    <section className="bg-white py-8 dark:bg-slate-950 sm:py-10">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-5">
        <div
          className="
            rounded-2xl
            bg-[#111111]
            px-4
            py-6
            shadow-2xl

            sm:rounded-3xl
            sm:px-6
            sm:py-7

            lg:px-6
            lg:py-8
          "
        >
          {/* =========================
              HEADER
          ========================= */}

          <div
            className="
              mb-6
              flex
              flex-col
              gap-6

              sm:mb-7

              lg:flex-row
              lg:items-center
              lg:justify-between
              lg:gap-8
            "
          >
            {/* LEFT */}

            <div className="flex min-w-0 items-center gap-3 sm:gap-4 md:gap-5">
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-emerald-500/10

                  sm:h-14
                  sm:w-14

                  md:h-16
                  md:w-16
                "
              >
                <Flame
                  className="
                    h-6
                    w-6
                    text-emerald-400

                    sm:h-7
                    sm:w-7

                    md:h-8
                    md:w-8
                  "
                />
              </div>

              <div className="min-w-0">
                <h2
                  className="
                    text-lg
                    font-bold
                    tracking-tight
                    text-white

                    sm:text-xl
                    md:text-2xl
                  "
                >
                  Flash Sale
                </h2>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-gray-400

                    sm:text-sm
                    md:text-base
                  "
                >
                  Hurry up, limited time only!
                </p>
              </div>
            </div>

            {/* RIGHT / COUNTDOWN */}

            <div
              className="
                flex
                w-full
                items-center

                lg:w-auto
                lg:justify-end
              "
            >
              <Countdown />
            </div>
          </div>

          {/* =========================
              PRODUCTS
          ========================= */}

          {offerProductsLoading ? (
            <div className="flex min-h-[250px] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div
                  className="
                    h-8
                    w-8
                    animate-spin
                    rounded-full
                    border-2
                    border-gray-700
                    border-t-emerald-500
                  "
                />

                <p className="text-sm text-gray-400">Loading offers...</p>
              </div>
            </div>
          ) : offerProductsError ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <p className="text-sm text-red-400">{offerProductsError}</p>
            </div>
          ) : offerProducts.length === 0 ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <p className="text-sm text-gray-400">
                No flash sale products available.
              </p>
            </div>
          ) : (
            <div
              className="
                flex
                gap-3
                overflow-x-auto
                pb-2

                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden

                sm:gap-4
                lg:gap-5
              "
            >
              {offerProducts.map((product) => (
                <div
                  key={product._id}
                  className="
                    w-[75%]
                    shrink-0

                    sm:w-[45%]

                    md:w-[32%]

                    lg:w-[28%]

                    xl:w-[24%]
                  "
                >
                  <FlashSaleCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
