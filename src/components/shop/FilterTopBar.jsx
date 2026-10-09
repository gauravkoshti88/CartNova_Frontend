import { X } from "lucide-react";
import FilterSidebar from "./FilterSidebar";

export default function FilterTopBar({
  filters,
  updateFilter,
  resetFilters,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
      <div
        className="
          absolute
          left-0
          right-0
          top-0
          max-h-[90vh]
          overflow-y-auto
          rounded-b-2xl
          bg-gray-50
          shadow-xl
          dark:bg-slate-950
        "
      >
        {/* HEADER */}

        <div
          className="
            sticky
            top-0
            z-20
            flex
            items-center
            justify-between
            border-b
            border-gray-200
            bg-white
            px-4
            py-4
            dark:border-slate-700
            dark:bg-slate-900
          "
        >
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-200 sm:text-lg">
            Filters
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-gray-600
              transition
              hover:bg-gray-100
              hover:text-gray-900
              dark:text-gray-300
              dark:hover:bg-slate-800
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* FILTER SIDEBAR */}

        <div className="p-3 sm:p-4">
          <FilterSidebar
            filters={filters}
            updateFilter={updateFilter}
            resetFilters={resetFilters}
          />
        </div>

        {/* BOTTOM ACTIONS */}

        <div
          className="
            sticky
            bottom-0
            z-20
            flex
            gap-3
            border-t
            border-gray-200
            bg-white
            p-4
            dark:border-slate-700
            dark:bg-slate-900
          "
        >
          <button
            type="button"
            onClick={resetFilters}
            className="
              flex-1
              rounded-xl
              border
              border-gray-300
              px-4
              py-2.5
              text-sm
              font-semibold
              text-gray-700
              transition
              hover:bg-gray-50
              dark:border-slate-700
              dark:text-gray-300
              dark:hover:bg-slate-800
            "
          >
            Clear All
          </button>

          <button
            type="button"
            onClick={onClose}
            className="
              flex-1
              rounded-xl
              bg-orange-500
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-orange-600
            "
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
