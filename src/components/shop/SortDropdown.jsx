import Select from "react-select";

const options = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "low-high", label: "Price: Low to High" },
  { value: "high-low", label: "Price: High to Low" },
  { value: "rating", label: "Best Rating" },
];

const selectStyles = {
  control: (base, state) => ({
    ...base,
    width: "100%",
    minHeight: "42px",
    borderRadius: "10px",
    borderColor: state.isFocused ? "#10b981" : "#d1d5db",
    boxShadow: "none",
    cursor: "pointer",
    "&:hover": {
      borderColor: "#10b981",
    },
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "0 10px",
  }),

  singleValue: (base) => ({
    ...base,
    fontSize: "14px",
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  dropdownIndicator: (base) => ({
    ...base,
    color: "#6b7280",
    "&:hover": {
      color: "#10b981",
    },
  }),

  menu: (base) => ({
    ...base,
    marginTop: "4px",
    borderRadius: "10px",
    overflow: "hidden",
    zIndex: 9999,
  }),

  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),

  option: (base, state) => ({
    ...base,
    padding: "9px 12px",
    fontSize: "14px",
    backgroundColor: state.isSelected
      ? "#10b981"
      : state.isFocused
        ? "#ecfdf5"
        : "#fff",
    color: state.isSelected ? "#fff" : "#111827",
    cursor: "pointer",
  }),
};

export default function SortDropdown({ value, onChange }) {
  return (
    <div className="w-[150px] shrink-0 sm:w-[180px] md:w-[210px] lg:w-[240px]">
      <Select
        options={options}
        value={options.find((item) => item.value === value) || options[0]}
        onChange={onChange}
        styles={selectStyles}
        isSearchable={false}
        isClearable={false}
        className="w-full"
        menuPortalTarget={document.body}
        menuPosition="fixed"
      />
    </div>
  );
}
