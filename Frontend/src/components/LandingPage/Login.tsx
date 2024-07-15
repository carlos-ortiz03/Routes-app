import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../slices/authSlice";

interface LoginProps {
  setShowForm: React.Dispatch<React.SetStateAction<"login" | "signup" | null>>;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Login: React.FC<LoginProps> = ({ setShowForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Logging in...");
      console.log("Backend URL:", backendUrl);
      const response = await axios.post(
        `${backendUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      console.log("User logged in:", response.data);
      dispatch(
        login({
          username: response.data.user.username,
          email: response.data.user.email,
        })
      );
      navigate("/home");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg max-w-md mx-auto border border-green-700 text-black">
      <h2 className="text-2xl font-raleway mb-4 text-green-700">Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 rounded border border-green-700"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 rounded border border-green-700"
        />
        <button
          type="submit"
          className="bg-green-700 hover:bg-green-900 text-white py-2 px-4 rounded-full w-full"
        >
          Login
        </button>
      </form>
      {error && <div className="mt-4 text-red-700">{error}</div>}
      <button
        className="mt-4 text-green-700 hover:underline"
        onClick={() => setShowForm(null)}
      >
        Back
      </button>
    </div>
  );
};

export default Login;
