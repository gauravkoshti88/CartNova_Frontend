import Breadcrumb from "../../components/Breadcrumb";
import { Heading } from "../../components/Heading";
import ProductCard from "../../components/product/ProductCard";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { usePublicProducts } from "../../hooks/usePublicProducts";

export default function NewArrivals() {
  useDocumentTitle("New-Arrivals");
  const { newArrivalProducts, newArrivalLoading } = usePublicProducts({
    getNewArrivals: true,
  });

  return (
    <section className=" w-fullmin-h-screen">
      <div className="max-w-7xl mx-auto px-5 pb-16">
        <Breadcrumb />

        <div className=" py-5">
          <Heading
            heading={"New Arrivals"}
            para={"Fresh products just added to our catalog"}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivalProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
