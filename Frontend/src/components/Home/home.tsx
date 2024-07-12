import React, { useState, useEffect } from "react";
import Header from "./Header";
import SavedRunsSidebar from "./SavedRunsSidebar";
import MainContent from "./MainContent";
import DisclaimerModal from "./DisclaimerModal";
import axios from "axios";
import { Route } from "../types"; // Adjust the import path according to your project structure

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Home: React.FC = () => {
  const [savedRoutes, setSavedRoutes] = useState<Route[]>([]); // Use Route[] type
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(true);

  useEffect(() => {
    const fetchSavedRoutes = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/routes`, {
          withCredentials: true,
        });
        setSavedRoutes(response.data);
      } catch (error) {
        console.error("Error fetching saved routes:", error);
      }
    };

    fetchSavedRoutes();
  }, []);

  const handleDeleteRoute = (routeId: string) => {
    setSavedRoutes((prevRoutes) =>
      prevRoutes.filter((route) => route._id !== routeId)
    );
  };

  const handleEditRoute = (routeId: string, newName: string) => {
    setSavedRoutes((prevRoutes) =>
      prevRoutes.map((route) =>
        route._id === routeId ? { ...route, name: newName } : route
      )
    );
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white p-4 space-y-4">
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />
      <Header />
      <div className="flex flex-grow space-x-4 overflow-hidden">
        <SavedRunsSidebar
          savedRoutes={savedRoutes}
          onDeleteRoute={handleDeleteRoute}
          onEditRoute={handleEditRoute}
        />
        <MainContent />
      </div>
    </div>
  );
};

export default Home;
