import ProductCard from "../../product/ProductCard";
import SectionHeading from "../SectionHeading";

export default function BestSeller({ products, loading }) {
  return (
    <section className="mx-auto w-full max-w-7xl mt-5 p-2">
      <div className="border border-gray-300 rounded-xl shadow-sm shadow-gray-400">
        <div className="p-2 md:px-5">
          <SectionHeading
            heading={"Best Sellers"}
            para={"Our customers' favourite products."}
            path="/best-sellers"
          />
        </div>
        <div className="border-t border-gray-300 mt-2"></div>
        <div
          className="
          mt-2
          px-2
          md:px-5
          py-4
          flex
          gap-3
          overflow-x-auto
          pb-2
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
          sm:gap-4
        "
        >
          {products?.map((product) => (
            <div key={product._id} className="w-[170px] shrink-0 sm:w-[250px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
