import React from "react";
import { useNavigate } from "react-router-dom";

function NoDataFound({ title, link }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h2 className="text-2xl font-semibold mb-2">No {title} Found</h2>
      <p className="text-gray-600 mb-6">
        You haven't added any {title.toLowerCase()} yet. Click the button below
        to create your first {title.toLowerCase()}.
      </p>

      <button
        onClick={() => navigate(link)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
      >
        Add New {title}
      </button>
    </div>
  );
}

export default NoDataFound;
