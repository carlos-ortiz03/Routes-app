import React from "react";
import { LoadScript } from "@react-google-maps/api";

const GoogleMapsWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <LoadScript
      googleMapsApiKey="my api key"
      libraries={["places"]}
      onLoad={() => console.log("Google Maps API loaded successfully")}
      onError={() => console.log("Error loading Google Maps API")}
    >
      {children}
    </LoadScript>
  );
};

export default GoogleMapsWrapper;
