import React, { useState } from "react";
import axios from "axios";

interface SignUpProps {
  setShowForm: React.Dispatch<React.SetStateAction<"login" | "signup" | null>>;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const SignUp: React.FC<SignUpProps> = ({ setShowForm }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Signing up...");
      console.log("Backend URL:", backendUrl);
      const response = await axios.post(
        `${backendUrl}/api/auth/signup`,
        { username, email, password },
        { withCredentials: true }
      );
      console.log("i");
      console.log("User signed up:", response.data);
      // Handle successful signup (e.g., redirect to login, show success message)
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg max-w-md mx-auto border border-amber-700 text-black">
      <h2 className="text-2xl font-raleway mb-4 text-amber-700">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 rounded border border-amber-700"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 rounded border border-amber-700"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 rounded border border-amber-700"
        />
        <button
          type="submit"
          className="bg-amber-700 hover:bg-amber-900 text-white py-2 px-4 rounded-full w-full"
        >
          Sign Up
        </button>
      </form>
      {error && <div className="mt-4 text-red-700">{error}</div>}
      <button
        className="mt-4 text-amber-700 hover:underline"
        onClick={() => setShowForm(null)}
      >
        Back
      </button>
    </div>
  );
};

export default SignUp;
