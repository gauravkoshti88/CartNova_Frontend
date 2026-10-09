import { useState } from "react";

export function DescriptionCell({ text }) {
  const [expanded, setExpanded] = useState(false);

  const shortText = text?.length > 60 ? text?.slice(0, 60) + "..." : text;

  return (
    <span className="text-gray-700 dark:text-gray-50">
      {expanded ? text : shortText}

      {text?.length > 60 && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="ml-2 text-blue-600 hover:underline text-xs"
        >
          {expanded ? "Read Less" : "Read More"}
        </button>
      )}
    </span>
  );
}
