import React, { useEffect, useState } from "react";
import { Map, Marker } from "@vis.gl/react-google-maps";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const MapComponent: React.FC = () => {
  const [center, setCenter] = useState({ lat: -34.397, lng: 150.644 });
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(pos);
          setUserLocation(pos);
        },
        () => {
          handleLocationError(true);
        }
      );
    } else {
      handleLocationError(false);
    }
  }, []);

  const handleLocationError = (browserHasGeolocation: boolean) => {
    const errorMessage = browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation.";
    console.error(errorMessage);
  };

  return (
    <div style={containerStyle}>
      <Map center={center} zoom={14}>
        {userLocation && (
          <Marker position={userLocation} title="You are here" />
        )}
      </Map>
    </div>
  );
};
export default MapComponent;
