import { Search } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import { X } from "lucide-react";

export function Input({ Icon, ...props }) {
  return (
    <div className="relative">
      <Icon
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400"
      />

      <input
        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        maxLength={props.maxLength}
        className={`w-full rounded-xl border border-gray-500 bg-white/10 py-3 pl-12 pr-4 text-gray-800 dark:text-gray-200 placeholder:text-gray-600 dark:placeholder:text-gray-200 outline-none transition-all ${props.focus}`}
      />
    </div>
  );
}

export const FormInput = ({
  formType,
  inputType,
  inputName,
  placeholder,
  label,
  value,
  setValue,
  index,
}) => {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase mb-1.5">
        {formType ? `${formType} Name` : label}
      </label>
      <input
        type={inputType}
        name={inputName}
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(index, e.target.value)}
        className="w-full px-3.5 py-2  border border-gray-200 rounded-xl text-sm text-gray-950 dark:text-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
      />
    </div>
  );
};

export function SearchBar({ placeholder, value, setValue }) {
  return (
    <div className="relative w-full sm:w-72">
      <Search
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
        size={18}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`w-full pl-10 pr-4 py-2.5 bg-white text-gray-600 placeholder:text-gray-500 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
      />
    </div>
  );
}

export default function ProductInput({
  label,

  name,

  value,

  onChange,

  placeholder,

  type = "text",

  Icon,

  className = "",

  readOnly,

  min,

  max,

  onBlur,
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        )}

        <input
          type={type}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          min={min}
          max={max}
          onBlur={onBlur}
          required
          className={clsx(
            "w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800",

            "py-3",

            Icon ? "pl-10" : "pl-4",

            "pr-4",

            "outline-none",

            "focus:ring-2",

            "focus:ring-blue-500",

            "transition",

            className,
          )}
        />
      </div>
    </div>
  );
}

export function Textarea({
  label,

  name,

  value,

  onChange,

  placeholder,

  rows = 4,

  className = "",
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </label>
      )}

      <textarea
        rows={rows}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className={clsx(
          "w-full",

          "rounded-xl",

          "border",

          "border-slate-300",

          "dark:border-slate-700",

          "bg-white",

          "dark:bg-slate-800",

          "p-4",

          "outline-none",

          "focus:ring-2",

          "focus:ring-blue-500",

          className,
        )}
      />
    </div>
  );
}

export function Select({
  label,

  value,

  onChange,

  options = [],

  className = "",

  name,
}) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}

      <select
        value={value}
        name={name}
        onChange={onChange}
        className={clsx(
          "w-full",

          "rounded-xl",

          "border",

          "border-slate-300",

          "dark:border-slate-700",

          "bg-white",

          "dark:bg-slate-800",

          "p-3",

          "outline-none",

          "focus:ring-2",

          "focus:ring-blue-500",

          "disabled:bg-slate-100",
          "disabled:dark:bg-slate-900",
          "disabled:text-slate-400",
          "disabled:border-slate-200",
          "disabled:dark:border-slate-800",
          "disabled:cursor-not-allowed",
          "disabled:opacity-70",

          className,
        )}
      >
        <option value="">Select</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function TagInput({
  label,

  value = [],

  onChange,

  name,
}) {
  const [input, setInput] = useState("");

  const addTag = (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    if (!input.trim()) return;

    if (value.includes(input)) return;

    onChange([...value, input]);

    setInput("");
  };

  const removeTag = (tag) => {
    onChange(value.filter((item) => item !== tag));
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}

      <div className="border rounded-xl p-3">
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((tag) => (
            <div
              key={tag}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2"
            >
              {tag}

              <button type="button" onClick={() => removeTag(tag)}>
                <X size={15} />
              </button>
            </div>
          ))}
        </div>

        <input
          value={input}
          name={name}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={addTag}
          placeholder="Type & Press Enter"
          className="w-full outline-none"
        />
      </div>
    </div>
  );
}

import { UploadCloud } from "lucide-react";

export function ImageUpload({
  label,

  multiple = true,

  accept = "image/*",

  onChange,
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>

      <label className="mt-2 border-2 border-dashed rounded-xl h-40 flex flex-col justify-center items-center cursor-pointer">
        <UploadCloud size={35} />

        <p className="mt-2">Click to Upload</p>

        <input
          hidden
          multiple={multiple}
          accept={accept}
          type="file"
          onChange={onChange}
        />
      </label>
    </div>
  );
}
