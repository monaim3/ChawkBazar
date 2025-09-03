import React from "react";
import { FaSpinner } from "react-icons/fa"; // You can use any icon from react-icons

const Loading = () => {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 `}>
      {/* Spinner Icon */}
      <FaSpinner
        className="animate-spin text-blue-500"
        size={30}
      />
     <p className="text-sm text-gray-600">Loading...</p>
    </div>
  );
};

export default Loading;
