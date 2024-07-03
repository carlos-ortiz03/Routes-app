import React, { useState } from "react";
import Header from "./Header";
import SavedRunsSidebar from "./SavedRunsSidebar";
import MainContent from "./MainContent";

const Home: React.FC = () => {
  const [savedRoutes, setSavedRoutes] = useState([]); // Placeholder for saved routes

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-grow">
        <SavedRunsSidebar savedRoutes={savedRoutes} />
        <MainContent />
      </div>
    </div>
  );
};

export default Home;
