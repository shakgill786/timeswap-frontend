import axios from "axios";
import { useState } from "react";

export default function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    await axios.post("http://127.0.0.1:8000/auth/register/", { username, password });
    alert("User registered!");
  };

  const login = async () => {
    const { data } = await axios.post("http://127.0.0.1:8000/auth/login/", {
      username,
      password,
    });
    localStorage.setItem("token", data.access_token);
    alert("Logged in!");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Login / Register</h1>
      <input className="border p-2" type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input className="border p-2" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={login} className="bg-blue-500 text-white px-4 py-2 rounded-md">Login</button>
      <button onClick={register} className="bg-green-500 text-white px-4 py-2 rounded-md">Register</button>
    </div>
  );
}
