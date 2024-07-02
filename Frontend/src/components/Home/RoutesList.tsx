import React from "react";

interface ListProps {
  routes: google.maps.DirectionsRoute[];
  onSelectRoute: (route: google.maps.DirectionsRoute) => void;
}

const RoutesList: React.FC<ListProps> = ({ routes, onSelectRoute }) => {
  return (
    <ul className="list-disc pl-5">
      {routes.map((route, index) => (
        <li key={index} onClick={() => onSelectRoute(route)}>
          {route.summary || `Route ${index + 1}`} -{" "}
          {route.legs && route.legs[0] && route.legs[0].distance
            ? route.legs[0].distance.text
            : "Distance not available"}
        </li>
      ))}
    </ul>
  );
};

export default RoutesList;
