import React from "react";

const MobileCategoryCard = ({ item }) => {
  return (
    <div className="w-[76px] sm:w-[90px] shrink-0 text-center">
      <div className="mx-auto h-[48px] w-[48px] sm:h-[58px] sm:w-[58px] overflow-hidden rounded-full border border-slate-200 bg-gray-100">
        <img
          src={item?.image?.url || item?.image}
          alt={item?.name || "Category"}
          className="h-full w-full object-cover"
        />
      </div>

      <p className="mt-2 truncate text-xs sm:text-sm font-medium text-slate-800">
        {item?.name}
      </p>
    </div>
  );
};

export default MobileCategoryCard;
