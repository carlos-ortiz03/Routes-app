import React from "react";
import { APIProvider } from "@vis.gl/react-google-maps";

const apiKey = "put-your-api-key-here";

const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <APIProvider
      apiKey={apiKey}
      onLoad={() => console.log("Maps API has loaded.")}
    >
      {children}
    </APIProvider>
  );
};

export default MapProvider;
