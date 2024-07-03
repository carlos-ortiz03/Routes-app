import React from "react";

interface ListProps {
  routes: any[];
  onSelectRoute: (route: any) => void;
  selectedRoute: any;
}

const convertDistance = (distance: number) => {
  return { km: distance / 1000, mi: (distance / 1000) * 0.621371 };
};

const RoutesList: React.FC<ListProps> = ({
  routes,
  onSelectRoute,
  selectedRoute,
}) => {
  if (!routes || routes.length === 0) {
    return <div>No routes available</div>;
  }

  return (
    <ul className="list-disc pl-5">
      {routes.map((route, index) => {
        const distances = convertDistance(route.distance);
        const isSelected =
          selectedRoute &&
          selectedRoute.features[0].geometry === route.geometry;

        return (
          <li
            key={index}
            onClick={() => onSelectRoute(route)}
            className={`mb-2 p-2 rounded-md cursor-pointer ${
              isSelected ? "bg-blue-100" : "bg-white"
            } shadow-md hover:bg-gray-100 transition duration-300`}
          >
            <div className="font-bold">Route {index + 1}</div>
            <div>{distances.km.toFixed(2)} kilometers</div>
            <div>{distances.mi.toFixed(2)} miles</div>
            <div>{route.weight_name}</div>
          </li>
        );
      })}
    </ul>
  );
};

export default RoutesList;
