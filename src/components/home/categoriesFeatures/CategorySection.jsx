import SectionHeading from "../SectionHeading";
import CategoryCard from "../categoriesFeatures/CategoryCard";
import MobileCategoryCard from "../categoriesFeatures/MobileCategoryCard";

const CategorySection = ({ categories }) => {
  return (
    <section className="mx-auto max-w-7xl border border-slate-300 p-1 px-2 sm:p-2 rounded-2xl">
      <div className="mt-1 flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mt-5">
        {categories.map((item) => (
          <MobileCategoryCard key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
