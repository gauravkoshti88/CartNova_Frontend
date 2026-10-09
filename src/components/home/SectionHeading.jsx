import { ArrowRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const SectionHeading = ({ heading, para, path }) => {
  const navigate = useNavigate();

  const onViewAll = (e) => {
    e.stopPropagation();
    if (!path) return;

    navigate(path);
  };

  return (
    <div className="flex w-full items-center justify-between gap-4">
      {/* Heading Content */}
      <div className="min-w-0">
        <h2
          className="
            text-lg
            font-bold
            leading-tight
            text-gray-900
            dark:text-gray-300
            sm:text-2xl
            md:text-3xl
          "
        >
          {heading}
        </h2>

        {para && (
          <p
            className="
              mt-1.5
              max-w-2xl
              text-xs
              leading-relaxed
              text-gray-500
              dark:text-gray-400
              sm:mt-2
              sm:text-sm
              md:text-base
            "
          >
            {para}
          </p>
        )}
      </div>

      {/* View All */}
      {path && (
        <button
          type="button"
          onClick={onViewAll}
          className="
            group
            flex
            w-fit
            shrink-0
            items-center
            gap-1.5
            text-xs
            font-semibold
            text-gray-700
            dark:text-gray-300
            transition-colors
            hover:text-orange-500
            sm:gap-2
            sm:text-sm
            md:text-base
          "
        >
          <span>View All</span>

          <ArrowRight
            size={16}
            className="
              transition-transform
              duration-300
              group-hover:translate-x-1
              sm:h-[18px]
              sm:w-[18px]
            "
          />
        </button>
      )}
    </div>
  );
};

export default SectionHeading;
