import React from "react";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-100 h-16">
      <div className="text-2xl font-bold">Your Logo</div>
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <img src="profile-pic-url" alt="Profile" className="w-full h-full" />
      </div>
    </header>
  );
};

export default Header;
