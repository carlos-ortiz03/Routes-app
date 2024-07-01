import React, { useState } from "react";
import { Autocomplete } from "@react-google-maps/api";

interface FormProps {
  onSearch: (location: string, mileage: number) => void;
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
}

const Form: React.FC<FormProps> = ({ onSearch, onPlaceSelected }) => {
  const [mileage, setMileage] = useState(0);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      onPlaceSelected(place);
    }
  };

  const handleSearch = () => {
    const location = autocomplete?.getPlace()?.formatted_address || "";
    onSearch(location, mileage);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input
            type="text"
            placeholder="Search for location"
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `240px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: "relative",
            }}
          />
        </Autocomplete>
        <input
          type="number"
          value={mileage}
          onChange={(e) => setMileage(Number(e.target.value))}
          placeholder="Mileage"
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `80px`,
            height: `32px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            height: `36px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            backgroundColor: `#007bff`,
            color: `#fff`,
            border: `none`,
            cursor: `pointer`,
          }}
        >
          Find Routes
        </button>
      </div>
    </div>
  );
};

export default Form;
