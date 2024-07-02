import React, { useState, useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";

interface FormProps {
  onSearch: (
    location: string,
    mileage: number,
    travelMode: google.maps.TravelMode
  ) => void;
}

const Form: React.FC<FormProps> = ({ onSearch }) => {
  const [location, setLocation] = useState("");
  const [mileage, setMileage] = useState(0);
  const [travelMode, setTravelMode] = useState<google.maps.TravelMode>(
    google.maps.TravelMode.WALKING
  );
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(location, mileage, travelMode);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex space-x-4">
        <div>
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={() => {
              if (autocompleteRef.current) {
                const place = autocompleteRef.current.getPlace();
                if (place) {
                  setLocation(place.formatted_address || "");
                }
              }
            }}
          >
            <input
              type="text"
              placeholder="Search for location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border p-2 w-full"
            />
          </Autocomplete>
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
            onChange={(e) =>
              setTravelMode(e.target.value as google.maps.TravelMode)
            }
            className="border p-2 w-full"
          >
            <option value={google.maps.TravelMode.WALKING}>Walking</option>
            <option value={google.maps.TravelMode.DRIVING}>Driving</option>
            <option value={google.maps.TravelMode.BICYCLING}>Bicycling</option>
            <option value={google.maps.TravelMode.TRANSIT}>Transit</option>
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
