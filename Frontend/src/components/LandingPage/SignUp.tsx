import React, { useState } from "react";
import axios from "axios";

interface SignUpProps {
  setShowForm: React.Dispatch<React.SetStateAction<"login" | "signup" | null>>;
}

const backendUrl =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_BACKEND_URL // Ensure this is set correctly for production, including /api if needed
    : "/api"; // Proxy will handle this in development

const SignUp: React.FC<SignUpProps> = ({ setShowForm }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Signing up...");
      console.log("Backend URL:", backendUrl);
      const response = await axios.post(
        `${backendUrl}/auth/signup`,
        { username, email, password },
        { withCredentials: true }
      );
      console.log("User signed up:", response.data);
      setShowForm("login"); // Redirect to login form or handle accordingly
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error || "Signup failed");
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
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
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 rounded border border-amber-700"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 rounded border border-amber-700"
          required
        />
        <button
          type="submit"
          className="bg-amber-700 hover:bg-amber-900 text-white py-2 px-4 rounded-full w-full"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
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
