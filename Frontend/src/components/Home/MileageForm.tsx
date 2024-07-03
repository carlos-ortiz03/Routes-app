import React, { useState } from "react";
import AutocompleteInput from "./AutocompleteInput";
import { Place } from "../types";

interface FormProps {
  onSearch: (location: string, mileage: number, travelMode: string) => void;
  onSelectPlace: (place: Place) => void;
}

const Form: React.FC<FormProps> = ({ onSearch, onSelectPlace }) => {
  const [location, setLocation] = useState("");
  const [mileage, setMileage] = useState("");
  const [travelMode, setTravelMode] = useState("walking");
  const [unit, setUnit] = useState("kilometers");

  const handleSelectPlace = (place: Place) => {
    setLocation(place.place_name);
    onSelectPlace(place);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mileageNumber = parseFloat(mileage);
    if (isNaN(mileageNumber)) {
      alert("Please enter a valid number for mileage.");
      return;
    }
    const mileageInKm =
      unit === "miles" ? mileageNumber * 1.60934 : mileageNumber;
    onSearch(location, mileageInKm, travelMode);
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUnit(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-4 items-center">
        <div className="relative w-full">
          <AutocompleteInput onSelect={handleSelectPlace} />
        </div>
        <div className="relative flex items-center w-1/4">
          <input
            type="text"
            placeholder="Distance"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            className="border p-2 w-full rounded-md"
          />
          <select
            value={unit}
            onChange={handleUnitChange}
            className="absolute right-0 h-full border-l rounded-r-md bg-gray-100 p-2 pl-4 pr-4"
            style={{
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
              background: "none",
            }}
          >
            <option value="kilometers">km</option>
            <option value="miles">mi</option>
          </select>
        </div>
        <div className="w-1/4">
          <select
            value={travelMode}
            onChange={(e) => setTravelMode(e.target.value)}
            className="border p-2 w-full rounded-md"
          >
            <option value="walking">Walking</option>
            <option value="driving">Driving</option>
            <option value="cycling">Bicycling</option>
          </select>
        </div>
        <div className="w-1/4">
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 w-full rounded-md hover:bg-blue-600 transition duration-300"
          >
            Find Routes
          </button>
        </div>
      </div>
    </form>
  );
};

export default Form;
