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
            access_token: import.meta.env.VITE_MAPBOX_API_KEY as string,
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
        className="border p-2 w-full bg-[#6b7280] text-gray-200 placeholder-gray-200"
      />
      {suggestions.length > 0 && (
        <ul className="border p-2 w-full bg-[#2b2929] absolute z-10">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="cursor-pointer hover:bg-[#525252] p-2 text-gray-200"
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
