import React, { useState } from "react";
import AutocompleteInput from "./AutocompleteInput";
import { Place } from "../types";
import { FaRunning, FaBicycle, FaCar } from "react-icons/fa";

interface FormProps {
  onSearch: (location: string, mileage: number, travelMode: string) => void;
  onSelectPlace: (place: Place) => void;
}

const Form: React.FC<FormProps> = ({ onSearch, onSelectPlace }) => {
  const [location, setLocation] = useState("");
  const [mileage, setMileage] = useState("");
  const [unit, setUnit] = useState("km");
  const [travelMode, setTravelMode] = useState("running");

  const handleSelectPlace = (place: Place) => {
    setLocation(place.place_name);
    onSelectPlace(place);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const distanceInKm =
      unit === "miles" ? parseFloat(mileage) * 1.60934 : parseFloat(mileage);
    onSearch(location, distanceInKm, travelMode);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end space-x-4 w-full bg-[#2b2929] p-4 rounded-lg shadow-lg"
    >
      <div className="flex flex-col w-2/5">
        <label className="text-sm mb-1 text-white">Address:</label>
        <AutocompleteInput onSelect={handleSelectPlace} />
      </div>
      <div className="flex flex-col w-1/5 sm:w-1/4 md:w-1/5">
        <label className="text-sm mb-1 text-white">Distance:</label>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Distance"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            className="border p-2 w-3/5 bg-[#6b7280] text-white placeholder-white rounded-l mr-0.5"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="border p-2 w-2/5 bg-[#6b7280] text-white rounded-r appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3e%3cpath fill='white' d='M10 12l-4-4h8z'/%3e%3c/svg%3e")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.5rem center",
              backgroundSize: "1rem",
            }}
          >
            <option value="km">km</option>
            <option value="miles">mi</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col w-1/5 sm:w-1/4 md:w-1/5">
        <label className="text-sm mb-1 text-white">Select your activity</label>
        <div className="flex items-center space-x-2 h-full">
          <button
            type="button"
            className={`p-2 flex-grow flex items-center justify-center rounded h-full ${
              travelMode === "running" ? "bg-[#298B45]" : "bg-gray-500"
            } ${
              travelMode !== "running" &&
              "hover:bg-gray-700 transition duration-300"
            }`}
            onClick={() => setTravelMode("running")}
            style={{ height: "42px" }} // Set height to match input fields
          >
            <FaRunning className="text-white" />
          </button>
          <button
            type="button"
            className={`p-2 flex-grow flex items-center justify-center rounded h-full ${
              travelMode === "cycling" ? "bg-[#298B45]" : "bg-gray-500"
            } ${
              travelMode !== "cycling" &&
              "hover:bg-gray-700 transition duration-300"
            }`}
            onClick={() => setTravelMode("cycling")}
            style={{ height: "42px" }} // Set height to match input fields
          >
            <FaBicycle className="text-white" />
          </button>
          <button
            type="button"
            className={`p-2 flex-grow flex items-center justify-center rounded h-full ${
              travelMode === "driving" ? "bg-[#298B45]" : "bg-gray-500"
            } ${
              travelMode !== "driving" &&
              "hover:bg-gray-700 transition duration-300"
            }`}
            onClick={() => setTravelMode("driving")}
            style={{ height: "42px" }} // Set height to match input fields
          >
            <FaCar className="text-white" />
          </button>
        </div>
      </div>
      <button
        type="submit"
        className="bg-[#298B45] hover:bg-[#217038] transition duration-300 text-white p-2 rounded w-1/5 sm:w-1/4 md:w-1/5 h-full"
      >
        Find Routes
      </button>
    </form>
  );
};

export default Form;
