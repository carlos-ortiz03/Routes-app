import React, { useState } from "react";
import Header from "./Header";
import SavedRunsSidebar from "./SavedRunsSidebar";
import MainContent from "./MainContent";
import DisclaimerModal from "./DisclaimerModal";

const Home: React.FC = () => {
  const [savedRoutes, setSavedRoutes] = useState([]); // Placeholder for saved routes
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-black text-white p-4 space-y-4">
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />
      <Header />
      <div className="flex flex-grow space-x-4 overflow-hidden">
        <SavedRunsSidebar savedRoutes={savedRoutes} />
        <MainContent />
      </div>
    </div>
  );
};

export default Home;
