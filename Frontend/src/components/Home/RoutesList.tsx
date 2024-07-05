import React from "react";
import { FaRunning, FaBicycle, FaCar } from "react-icons/fa";

interface ListProps {
  routes: any[];
  onSelectRoute: (route: any) => void;
  selectedRoute: any;
}

const convertDistance = (distance: number, unit: string) => {
  return unit === "miles" ? (distance / 1000) * 0.621371 : distance / 1000;
};

const RoutesList: React.FC<ListProps> = ({
  routes,
  onSelectRoute,
  selectedRoute,
}) => {
  if (!routes || routes.length === 0) {
    return (
      <div className="bg-[#2B2929] p-4 rounded-lg text-white">
        No routes available
      </div>
    );
  }

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

  return (
    <div className="bg-[#2B2929] rounded-lg text-white space-y-2 h-full max-h-full overflow-y-auto">
      <ul className="space-y-2">
        {routes.map((route, index) => (
          <li
            key={index}
            onClick={() => onSelectRoute(route)}
            className={`p-4 rounded-lg ${
              selectedRoute &&
              selectedRoute.features &&
              selectedRoute.features[0].geometry === route.geometry
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
              <button className="bg-[#FF6F3D] hover:bg-[#de5f35] text-white p-2 rounded">
                Save
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoutesList;
