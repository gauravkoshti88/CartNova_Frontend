import Breadcrumb from "../../components/Breadcrumb";
import { Heading } from "../../components/Heading";
import ProductCard from "../../components/product/ProductCard";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { usePublicProducts } from "../../hooks/usePublicProducts";

export default function BestSellers() {
  useDocumentTitle("Best-Sellers");
  const { bestSellerProducts, bestSellerLoading } = usePublicProducts({
    getBestSeller: true,
  });
  return (
    <section className="w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-5 pb-16">
        <Breadcrumb />

        <div className="py-5">
          <Heading
            heading={"Best Sellers"}
            para={"Our most popular products"}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellerProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
