import { Star } from "lucide-react";

export default function ProductRating({ rating, reviews }) {
  return (
    <div className="flex items-center gap-2 mt-1">
      <Star size={16} className="fill-yellow-400 text-yellow-400" />

      <span className="text-sm font-medium dark:text-white">{rating}</span>

      <span className="text-sm text-gray-500 dark:text-gray-300">
        ({reviews})
      </span>
    </div>
  );
}
