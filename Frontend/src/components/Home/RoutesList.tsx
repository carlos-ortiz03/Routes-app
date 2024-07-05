import React, { useState } from "react";
import { FaRunning, FaBicycle, FaCar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentRoute, setSavedRoutes } from "../../slices/routesSlice";
import { Route, GeoJsonRoute } from "../types";
import axios from "axios";
import { RootState } from "../../store";

interface ListProps {
  routes: Route[];
  onSelectRoute: (route: Route) => void;
  selectedRoute: GeoJsonRoute | null;
}

const convertDistance = (distance: number, unit: string) => {
  return unit === "miles" ? (distance / 1000) * 0.621371 : distance / 1000;
};

const RoutesList: React.FC<ListProps> = ({
  routes,
  onSelectRoute,
  selectedRoute,
}) => {
  const dispatch = useDispatch();
  const savedRoutes = useSelector(
    (state: RootState) => state.routes.savedRoutes
  );
  const [namePrompt, setNamePrompt] = useState<string | null>(null);
  const [currentRoute, setCurrentRouteState] = useState<Route | null>(null);

  const handleRouteClick = (route: Route) => {
    const geojson: GeoJsonRoute = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: route.geometry,
          properties: { travelMode: route.travelMode, name: route.name },
        },
      ],
    };
    dispatch(setCurrentRoute(geojson));
    onSelectRoute(route);
  };

  const handleSaveRoute = async () => {
    if (!currentRoute) return;

    try {
      const response = await axios.post(
        "http://localhost:5001/api/routes/save",
        {
          name: namePrompt,
          distance: currentRoute.distance,
          geometry: currentRoute.geometry,
          travelMode: currentRoute.travelMode,
        },
        { withCredentials: true }
      );
      dispatch(setSavedRoutes([...savedRoutes, response.data]));
      console.log("Route saved successfully:", response.data);
      setNamePrompt(null);
      setCurrentRouteState(null);
    } catch (error) {
      console.error("Error saving route:", error);
    }
  };

  const promptForName = (route: Route) => {
    setCurrentRouteState(route);
    setNamePrompt("");
  };

  const getIcon = (travelMode: string) => {
    switch (travelMode) {
      case "running":
        return <FaRunning className="text-white" />;
      case "cycling":
        return <FaBicycle className="text-white" />;
      case "driving":
        return <FaCar className="text-white" />;
      default:
        return null;
    }
  };

  if (!routes || routes.length === 0) {
    return (
      <div className="bg-[#2B2929] p-4 rounded-lg text-white">
        No routes available
      </div>
    );
  }

  return (
    <div className="bg-[#2B2929] rounded-lg text-white space-y-2 h-full max-h-full overflow-y-auto">
      <ul className="space-y-2">
        {routes.map((route, index) => (
          <li
            key={index}
            onClick={() => handleRouteClick(route)}
            className={`p-4 rounded-lg ${
              selectedRoute &&
              selectedRoute.features &&
              selectedRoute.features[0].geometry.coordinates.toString() ===
                route.geometry.coordinates.toString()
                ? "bg-[#298B45]"
                : "bg-[#525252] hover:bg-[#404040] cursor-pointer"
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              {/* Icon and Route Name */}
              <div>{getIcon(route.travelMode)}</div>
              <div className="font-bold">
                {route.name ? route.name : `Route ${index + 1}`}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>{`${convertDistance(route.distance, "miles").toFixed(
                2
              )} mi`}</div>
              <div>{`${convertDistance(route.distance, "kilometers").toFixed(
                2
              )} km`}</div>
              {/* Save button */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the route click event
                  promptForName(route);
                }}
                className="bg-[#FF6F3D] hover:bg-[#de5f35] text-white p-2 rounded"
              >
                Save
              </button>
            </div>
          </li>
        ))}
      </ul>

      {namePrompt !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-[#2B2929] p-4 rounded-lg shadow-lg space-y-4 w-1/3">
            <h2 className="text-xl font-bold mb-4">Save Route</h2>
            <input
              type="text"
              value={namePrompt}
              onChange={(e) => setNamePrompt(e.target.value)}
              placeholder="Enter route name"
              className="w-full p-2 rounded bg-[#525252] text-white"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleSaveRoute}
                className="bg-[#298B45] hover:bg-[#27693b] text-white p-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setNamePrompt(null)}
                className="bg-gray-300 hover:bg-gray-400 text-black p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutesList;
