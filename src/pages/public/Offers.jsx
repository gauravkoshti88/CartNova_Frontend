import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Breadcrumb from "../../components/Breadcrumb";
import { Heading } from "../../components/Heading";
import PromoBanner from "../../components/home/promoBanner/PromoBanner";
import ProductCard from "../../components/product/ProductCard";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

import { getProductsOffer } from "../../redux/thunks/publicProductThunk";

export default function Offers() {
  useDocumentTitle("Offers");

  const dispatch = useDispatch();

  const website = useSelector((state) => state.website.website);

  const {
    offerProducts = [],
    offerProductsLoading,
    offerProductsError,
  } = useSelector((state) => state.publicProduct);

  useEffect(() => {
    if (!offerProducts.length) {
      dispatch(getProductsOffer());
    }
  }, [dispatch, offerProducts.length]);

  return (
    <section className="min-h-screen w-full">
      <div className="mx-auto max-w-7xl px-5 pb-16">
        <Breadcrumb />

        <div className="py-5">
          <Heading
            heading="Special Offers"
            para="Save big on premium products. Limited time only!"
          />
        </div>

        <PromoBanner website={website} />

        {/* ===================================================== */}
        {/* OFFER PRODUCTS */}
        {/* ===================================================== */}

        <div className="mt-10">
          {offerProductsLoading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div
                  className="
                    h-8
                    w-8
                    animate-spin
                    rounded-full
                    border-2
                    border-gray-200
                    border-t-emerald-500
                  "
                />

                <p className="text-sm text-gray-500">Loading offers...</p>
              </div>
            </div>
          ) : offerProductsError ? (
            <div className="flex min-h-[250px] items-center justify-center">
              <p className="text-sm text-red-500">{offerProductsError}</p>
            </div>
          ) : offerProducts?.length === 0 ? (
            <div className="flex min-h-[250px] items-center justify-center">
              <p className="text-sm text-gray-500">
                No special offers available right now.
              </p>
            </div>
          ) : (
            <div
              className="
                grid
                grid-cols-1
                gap-6
                sm:grid-cols-2
                lg:grid-cols-4
              "
            >
              {offerProducts?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
