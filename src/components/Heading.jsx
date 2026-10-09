import React from "react";

export const Heading = ({ heading, para, className = "" }) => {
  return (
    <div
      className="
        min-w-0
        rounded-lg
        bg-white
        px-4
        py-2.5
        shadow-sm
        shadow-gray-300

        dark:bg-slate-800
        dark:shadow-slate-950

        sm:px-5
        sm:py-3

        md:px-6

        lg:px-7
      "
    >
      <h1
        className={`
          text-base
          font-bold
          leading-tight
          tracking-tight
          text-slate-900

          dark:text-slate-100

          sm:text-lg
          md:text-xl
          lg:text-2xl

          ${className}
        `}
      >
        {heading}
      </h1>

      {para && (
        <p
          className="
            mt-1
            max-w-2xl
            text-[11px]
            leading-relaxed
            text-gray-600

            dark:text-gray-300

            sm:text-xs
            md:text-sm
            lg:text-base
          "
        >
          {para}
        </p>
      )}
    </div>
  );
};

// =========================================================
// SECTION TITLE
// =========================================================

export default function SectionTitle({ title, description }) {
  return (
    <div
      className="
        mb-4

        sm:mb-5
        md:mb-6
      "
    >
      <h3
        className="
          text-base
          font-semibold
          leading-tight
          tracking-tight
          text-slate-900

          dark:text-white

          sm:text-lg
          md:text-xl
          lg:text-2xl
        "
      >
        {title}
      </h3>

      {description && (
        <p
          className="
            mt-1
            max-w-2xl
            text-[11px]
            leading-relaxed
            text-gray-500

            dark:text-gray-400

            sm:text-xs
            md:text-sm
            lg:text-base
          "
        >
          {description}
        </p>
      )}
    </div>
  );
}
