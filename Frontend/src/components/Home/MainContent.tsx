import React, { useState, useEffect } from "react";
import Form from "./MileageForm";
import List from "./RoutesList";
import MapComponent from "./Map";
import axios from "axios";

const MainContent: React.FC = () => {
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [selectedRoute, setSelectedRoute] =
    useState<google.maps.DirectionsResult | null>(null);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });
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
          console.error("Error: The Geolocation service failed.");
        }
      );
    } else {
      console.error("Error: Your browser doesn't support geolocation.");
    }
  }, []);

  const handleSearch = async (location: string, mileage: number) => {
    console.log("Initiating search with the following parameters:");
    console.log("Location:", location);
    console.log("Mileage:", mileage);

    try {
      const response = await axios.get(
        "http://localhost:5001/api/maps/directions",
        {
          params: {
            origin: location || "current location",
            destination: location || "current location",
          },
        }
      );

      console.log("Received response from backend:", response.data);

      // Filter routes based on mileage
      const filteredRoutes = response.data.routes.filter(
        (route: google.maps.DirectionsRoute) => {
          const routeDistance =
            route.legs.reduce(
              (acc: number, leg: google.maps.DirectionsLeg) =>
                acc + (leg.distance?.value || 0),
              0
            ) / 1000; // distance in km
          return routeDistance <= mileage;
        }
      );

      console.log("Filtered routes based on mileage:", filteredRoutes);

      setRoutes(filteredRoutes);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const handleSelectRoute = (route: google.maps.DirectionsRoute) => {
    console.log("Selected route:", route);
    const request: google.maps.DirectionsRequest = {
      origin: route.legs[0].start_location,
      destination: route.legs[0].end_location,
      travelMode: google.maps.TravelMode.DRIVING,
    };
    setSelectedRoute({ routes: [route], request });
  };

  return (
    <div className="flex flex-col w-3/4 p-4">
      <div className="mb-4">
        <Form onSearch={handleSearch} />
      </div>
      <div className="mb-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">Routes Generated</h2>
        <List routes={routes} onSelectRoute={handleSelectRoute} />
      </div>
      <div className="flex-grow">
        <MapComponent center={center} directions={selectedRoute} />
      </div>
    </div>
  );
};

export default MainContent;
