import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentRoute } from "../../slices/routesSlice";
import { Route, GeoJsonRoute } from "../types";
import { RootState } from "../../store";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface SavedRunsSidebarProps {
  savedRoutes: Route[];
  onDeleteRoute: (routeId: string) => void;
  onEditRoute: (routeId: string, newName: string) => void;
}

const convertDistance = (distance: number, unit: string) => {
  return unit === "miles" ? (distance / 1000) * 0.621371 : distance / 1000;
};

const SavedRunsSidebar: React.FC<SavedRunsSidebarProps> = ({
  savedRoutes,
  onDeleteRoute,
  onEditRoute,
}) => {
  const dispatch = useDispatch();
  const currentRoute = useSelector(
    (state: RootState) => state.routes.currentRoute
  );
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>("");

  const deleteRoute = async (routeId: string) => {
    try {
      await axios.delete(`${backendUrl}/api/routes/${routeId}`, {
        withCredentials: true,
      });
      onDeleteRoute(routeId);
    } catch (error) {
      console.error("Error deleting route:", error);
    }
  };

  const editRoute = (routeId: string, name: string) => {
    setIsEditing(routeId);
    setNewName(name);
  };

  const saveEdit = async (routeId: string) => {
    try {
      await axios.put(
        `${backendUrl}/api/routes/${routeId}`,
        { name: newName },
        { withCredentials: true }
      );
      onEditRoute(routeId, newName);
      setIsEditing(null);
      setNewName("");
    } catch (error) {
      console.error("Error editing route:", error);
    }
  };

  const selectRoute = (route: Route) => {
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
  };

  return (
    <aside className="w-1/4 bg-[#2B2929] p-4 rounded-lg shadow-lg space-y-4">
      <h2 className="text-xl font-bold mb-4">Saved Routes</h2>
      <ul>
        {savedRoutes.map((route) => (
          <li
            key={route._id}
            className={`mb-4 p-4 rounded-lg shadow-md flex flex-col space-y-2 cursor-pointer ${
              currentRoute &&
              currentRoute.features &&
              currentRoute.features[0].geometry.coordinates.toString() ===
                route.geometry.coordinates.toString()
                ? "bg-[#298B45]"
                : "bg-[#525252] hover:bg-[#404040]"
            }`}
            onClick={() => selectRoute(route)}
          >
            {isEditing === route._id ? (
              <div className="flex flex-col">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="mb-2 p-2 bg-[#2B2929] text-white rounded"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => saveEdit(route._id)}
                    className="bg-[#b56814] hover:bg-[#9e5812] text-white p-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(null)}
                    className="bg-gray-300 hover:bg-gray-400 text-black p-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <div className="font-bold text-lg">{route.name}</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      editRoute(route._id, route.name);
                    }}
                    className="bg-[#b56814] hover:bg-[#9e5812] text-white p-2 rounded w-20" // Set a fixed width
                  >
                    Edit
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div>{`${convertDistance(route.distance, "miles").toFixed(
                    2
                  )} mi / ${convertDistance(
                    route.distance,
                    "kilometers"
                  ).toFixed(2)} km`}</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteRoute(route._id);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded w-20" // Set a fixed width
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SavedRunsSidebar;
