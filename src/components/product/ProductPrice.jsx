export default function ProductPrice({ price, oldPrice }) {
  return (
    <div className="flex gap-1 sm:items-center sm:gap-2">
      {/* Sale Price */}
      <span className="text-lg font-bold leading-5 text-orange-500 sm:text-xl md:text-2xl">
        ₹
        {Number(price).toLocaleString("en-IN", {
          maximumFractionDigits: 2,
        })}
      </span>

      {/* Old Price */}
      {oldPrice > price && (
        <span className="pl-1 text-[14px] text-gray-400 dark:text-gray-300 line-through sm:pl-0 sm:text-xs md:text-sm">
          ₹{Number(oldPrice).toLocaleString("en-IN")}
        </span>
      )}
    </div>
  );
}
