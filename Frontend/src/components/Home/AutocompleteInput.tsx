// src/components/AutocompleteInput.tsx
import React, { useEffect, useRef } from "react";

const AutocompleteInput: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!window.google) {
      console.error("Google Maps JavaScript API library must be loaded.");
      return;
    }

    if (inputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["address"],
          componentRestrictions: { country: "us" },
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          console.log("Selected place:", place);
        }
      });
    }
  }, []);

  return <input ref={inputRef} type="text" placeholder="Enter an address" />;
};

export default AutocompleteInput;
