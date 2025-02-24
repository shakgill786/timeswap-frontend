import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // ✅ Register User
  const register = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/register/`, { username, password });
      alert("User registered! Please log in.");
    } catch (error) {
      alert("Registration failed. Username may already exist.");
      console.error("Registration error:", error);
    }
  };

  // ✅ Login User & Store Token
  const login = async () => {
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/auth/login/`,
        new URLSearchParams({ username, password }), // ✅ Properly formatted request
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      localStorage.setItem("token", data.access_token); // ✅ Store token
      alert("Logged in successfully!");
      navigate("/dashboard"); // ✅ Redirect to dashboard
    } catch (error) {
      alert("Login failed. Check credentials.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Login / Register</h1>
      <input
        className="border p-2 w-full mb-2 rounded-md"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-2 rounded-md"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex gap-2 mt-4">
        <button onClick={login} className="bg-blue-500 text-white px-4 py-2 rounded-md w-1/2">
          Login
        </button>
        <button onClick={register} className="bg-green-500 text-white px-4 py-2 rounded-md w-1/2">
          Register
        </button>
      </div>
    </div>
  );
}
