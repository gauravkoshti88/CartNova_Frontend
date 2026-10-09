import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");

  // =========================================================
  // KEEP INPUT IN SYNC WITH URL
  // =========================================================

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search") || "";

    setSearch(query);
  }, [location.search]);

  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearch = () => {
    const value = search.trim();

    if (!value) {
      // Empty search -> normal shop page
      navigate("/shop");
      return;
    }

    navigate(`/shop?search=${encodeURIComponent(value)}`);
  };

  // =========================================================
  // ENTER KEY
  // =========================================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // =========================================================
  // CLEAR
  // =========================================================

  const handleClear = () => {
    setSearch("");
    navigate("/shop");
  };

  return (
    <div className="max-w-2xl md:max-w-full lg:w-full lg:mx-15">
      <div className="relative w-full">
        {/* Search Icon */}
        <button
          type="button"
          onClick={handleSearch}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-400
            transition
            hover:text-orange-500
            dark:text-gray-500
          "
          aria-label="Search"
        >
          <Search size={20} />
        </button>

        {/* Input */}
        <input
          type="text"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search products, brands, categories..."
          className="
            w-full
            rounded-full
            bg-gray-100
            py-3
            pl-12
            pr-12
            outline-none
            transition
            focus:ring-2
            focus:ring-orange-500
            dark:bg-slate-200
            dark:text-gray-900
          "
        />

        {/* Clear Button */}
        {search && (
          <button
            type="button"
            onClick={handleClear}
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-gray-400
              transition
              hover:text-red-500
            "
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
