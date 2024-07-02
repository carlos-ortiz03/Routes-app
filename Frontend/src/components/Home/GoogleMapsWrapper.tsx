import React from "react";
import { LoadScript } from "@react-google-maps/api";

const apiKey = "YOUR_API_KEY";

const GoogleMapsWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <LoadScript googleMapsApiKey="put key here" libraries={["places"]}>
      {children}
    </LoadScript>
  );
};

export default GoogleMapsWrapper;
