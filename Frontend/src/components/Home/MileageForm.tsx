import React, { useState } from "react";

interface FormProps {
  onSearch: (location: string, mileage: number) => void;
}

const Form: React.FC<FormProps> = ({ onSearch }) => {
  const [mileage, setMileage] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(location, parseFloat(mileage));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Starting Location:
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter starting location or use current location"
          className="mt-1 p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Desired Mileage:
        </label>
        <input
          type="number"
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
          placeholder="Enter desired mileage"
          className="mt-1 p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Find Routes
      </button>
    </form>
  );
};

export default Form;
