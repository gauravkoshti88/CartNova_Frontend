import CollectionCard from "./CollectionCard";
import { collections } from "./collectionData";
import SectionHeading from "../SectionHeading";

export default function TopCollections() {
  return (
    <section className="mx-auto mt-6 w-full max-w-7xl px-3 sm:px-4 lg:px-5">
      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-gray-200
          bg-white
          shadow-sm
          dark:border-slate-800
          dark:bg-slate-950
        "
      >
        {/* Heading */}
        <div className="px-3 pt-4 sm:px-5 sm:pt-5">
          <SectionHeading
            heading="Top Collections"
            para="Curated edits for every lifestyle"
          />
        </div>

        {/* Divider */}
        <div className="mt-3 border-t border-gray-200 dark:border-slate-800" />

        {/* Collections */}
        <div
          className="
            flex
            gap-3
            overflow-x-auto
            px-3
            py-4
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden

            sm:gap-4
            sm:px-5
            sm:py-5
          "
        >
          {collections.map((item) => (
            <div
              key={item.id}
              className="
                w-[82vw]
                shrink-0

                sm:w-[65vw]
                md:w-[46vw]
                lg:w-[31vw]
                xl:w-[29vw]
              "
            >
              <CollectionCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
