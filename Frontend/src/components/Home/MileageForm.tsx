import React, { useState } from "react";

interface FormProps {
  onSearch: (location: string, mileage: number) => void;
}

const MileageForm: React.FC<FormProps> = ({ onSearch }) => {
  const [location, setLocation] = useState("");
  const [mileage, setMileage] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(location, mileage);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full p-2 mb-4 rounded border"
      />
      <input
        type="number"
        placeholder="Mileage"
        value={mileage}
        onChange={(e) => setMileage(Number(e.target.value))}
        className="w-full p-2 mb-4 rounded border"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Search
      </button>
    </form>
  );
};

export default MileageForm;
