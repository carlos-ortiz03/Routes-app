import React, { useState } from "react";
import AutocompleteInput from "./AutocompleteInput";
import { Place } from "../types";

interface FormProps {
  onSearch: (location: string, mileage: number, travelMode: string) => void;
  onSelectPlace: (place: Place) => void;
}

const Form: React.FC<FormProps> = ({ onSearch, onSelectPlace }) => {
  const [location, setLocation] = useState("");
  const [mileage, setMileage] = useState(0);
  const [travelMode, setTravelMode] = useState("walking");

  const handleSelectPlace = (place: Place) => {
    setLocation(place.place_name);
    onSelectPlace(place);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(location, mileage, travelMode);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex space-x-4">
        <div className="relative">
          <AutocompleteInput onSelect={handleSelectPlace} />
        </div>
        <div>
          <input
            type="number"
            placeholder="Enter mileage"
            value={mileage}
            onChange={(e) => setMileage(Number(e.target.value))}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <select
            value={travelMode}
            onChange={(e) => setTravelMode(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="walking">Walking</option>
            <option value="driving">Driving</option>
            <option value="cycling">Bicycling</option>
          </select>
        </div>
        <div>
          <button type="submit" className="bg-blue-500 text-white p-2">
            Find Routes
          </button>
        </div>
      </div>
    </form>
  );
};

export default Form;
