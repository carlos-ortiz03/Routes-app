import React, { useState } from "react";
import axios from "axios";
import { Place } from "../types";

const AutocompleteInput: React.FC<{ onSelect: (place: Place) => void }> = ({
  onSelect,
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Place[]>([]);

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setQuery(value);

    if (value.length > 2) {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json`,
        {
          params: {
            access_token: "put key here",
            autocomplete: true,
          },
        }
      );

      setSuggestions(
        response.data.features.map((feature: any) => ({
          id: feature.id,
          place_name: feature.place_name,
          geometry: feature.geometry,
        }))
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: Place) => {
    setQuery(suggestion.place_name);
    setSuggestions([]);
    onSelect(suggestion);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Enter an address"
        className="border p-2 w-full"
      />
      {suggestions.length > 0 && (
        <ul className="border p-2 w-full bg-white absolute z-10">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="cursor-pointer hover:bg-gray-200 p-2"
            >
              {suggestion.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;