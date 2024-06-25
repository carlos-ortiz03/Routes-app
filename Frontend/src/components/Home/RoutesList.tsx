import React from "react";

interface ListProps {
  routes: any[];
  onSelectRoute: (route: any) => void;
}

const List: React.FC<ListProps> = ({ routes, onSelectRoute }) => {
  return (
    <ul>
      {routes.map((route, index) => (
        <li
          key={index}
          onClick={() => onSelectRoute(route)}
          className="mb-4 p-4 bg-white rounded-lg shadow-md cursor-pointer"
        >
          <div className="font-bold">{route.summary}</div>
          <div>{route.legs[0].distance.text}</div>
        </li>
      ))}
    </ul>
  );
};

export default List;
