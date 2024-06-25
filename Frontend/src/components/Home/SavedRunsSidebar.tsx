import React from "react";

interface SavedRunsSidebarProps {
  savedRoutes: any[]; // Replace `any` with your route type
}

const SavedRunsSidebar: React.FC<SavedRunsSidebarProps> = ({ savedRoutes }) => {
  return (
    <aside className="w-1/4 bg-gray-200 p-4 shadow-lg">
      <h2 className="text-xl font-bold mb-4">Saved Routes</h2>
      <ul>
        {savedRoutes.map((route, index) => (
          <li key={index} className="mb-4 p-4 bg-white rounded-lg shadow-md">
            <div className="font-bold">{route.name}</div>
            <div>{route.distance} mi</div>
            <div>{route.elevation} ft</div>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SavedRunsSidebar;
