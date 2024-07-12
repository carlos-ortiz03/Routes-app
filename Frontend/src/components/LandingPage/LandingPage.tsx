import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Transition } from "@headlessui/react";
import VideoBackground from "./VideoBackground";
import Login from "./Login";
import SignUp from "./SignUp";
import axios from "axios";
import { login } from "../../slices/authSlice";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const LandingPage: React.FC = () => {
  const [showForm, setShowForm] = useState<"login" | "signup" | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/auth/checkAuth`, {
          withCredentials: true,
        });
        dispatch(
          login({
            username: response.data.username,
            email: response.data.email,
          })
        );
        navigate("/home");
      } catch (error) {
        console.log("User is not authenticated");
      }
    };
    checkAuth();
  }, [navigate, dispatch]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <VideoBackground />
      <div className="absolute inset-0 flex items-center justify-center text-white">
        <div className="relative z-10 text-center p-6">
          {showForm === null && (
            <div>
              <h1 className="text-4xl font-lobster mb-6 animate-fadeIn">
                Welcome to Route Finder
              </h1>
              <div className="space-x-4 animate-fadeIn">
                <button
                  className="bg-amber-600 bg-opacity-80 hover:bg-opacity-90 text-white font-raleway py-2 px-6 rounded-full transition duration-300 shadow-lg"
                  onClick={() => setShowForm("signup")}
                >
                  Sign Up
                </button>
                <button
                  className="bg-green-600 bg-opacity-80 hover:bg-opacity-90 text-white font-raleway py-2 px-6 rounded-full transition duration-300 shadow-lg"
                  onClick={() => setShowForm("login")}
                >
                  Login
                </button>
              </div>
            </div>
          )}
          <Transition
            show={showForm !== null}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="relative z-20 animate-fadeIn">
              {showForm === "login" && <Login setShowForm={setShowForm} />}
              {showForm === "signup" && <SignUp setShowForm={setShowForm} />}
            </div>
          </Transition>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
