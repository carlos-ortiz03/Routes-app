import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

interface MapComponentProps {
  center: { lat: number; lng: number };
  directions: google.maps.DirectionsResult | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ center, directions }) => {
  const apiKey = "AIzaSyCckibEMMSLLsKIW8YRUNHdmtv0AzHcQYI";

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
        {directions && <DirectionsRenderer directions={directions} />}
        <Marker position={center} title="You are here" />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
