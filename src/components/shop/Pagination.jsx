import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
    currentPage = 1,
    totalPages = 2,
    onPageChange,
}) {
    return (
        <div className="mt-12 flex items-center justify-center gap-3">

            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-300 bg-white disabled:cursor-not-allowed disabled:opacity-40 hover:border-emerald-500 hover:text-emerald-500"
            >
                <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index}
                    onClick={() => onPageChange(index + 1)}
                    className={`flex h-11 w-11 items-center justify-center rounded-xl font-semibold transition ${currentPage === index + 1
                            ? "bg-black text-white"
                            : "border border-gray-300 bg-white text-gray-700 hover:border-emerald-500 hover:text-emerald-500"
                        }`}
                >
                    {index + 1}
                </button>
            ))}

            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-300 bg-white disabled:cursor-not-allowed disabled:opacity-40 hover:border-emerald-500 hover:text-emerald-500"
            >
                <ChevronRight size={18} />
            </button>

        </div>
    );
}