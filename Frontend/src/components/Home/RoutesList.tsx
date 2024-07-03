import React from "react";

interface ListProps {
  routes: any[];
  onSelectRoute: (route: any) => void;
  unit: string;
}

const convertDistance = (distance: number, unit: string) => {
  return unit === "miles" ? (distance / 1000) * 0.621371 : distance / 1000;
};

const RoutesList: React.FC<ListProps> = ({ routes, onSelectRoute, unit }) => {
  if (!routes || routes.length === 0) {
    return <div>No routes available</div>;
  }

  return (
    <ul className="list-disc pl-5">
      {routes.map((route, index) => (
        <li key={index} onClick={() => onSelectRoute(route)}>
          {`Route ${index + 1}: ${
            route.distance
              ? convertDistance(route.distance, unit).toFixed(2)
              : "Distance not available"
          } ${unit} (${route.distance ? route.weight_name : "undefined"})`}
        </li>
      ))}
    </ul>
  );
};

export default RoutesList;
