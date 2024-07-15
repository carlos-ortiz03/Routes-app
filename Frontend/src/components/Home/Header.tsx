import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logout } from "../../slices/authSlice";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="flex justify-between items-center p-4 h-16">
      <div className="text-2xl font-bold">Routecrafter</div>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-800 text-white py-2 px-4 rounded-full"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
