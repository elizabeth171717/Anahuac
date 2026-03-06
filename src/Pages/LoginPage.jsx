// Login.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../constants/constants";
// Determine the backend URL based on the environment

const client = import.meta.env.VITE_CLIENT;
console.log("📦 Backend URL:", BACKEND_URL);
console.log("🏷️ Client tenant:", client);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // 🚨 stop page reload
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/${client}/login`, {
        email,
        password,
      });

      const data = res.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("restaurantName", data.user.restaurantName);
      localStorage.setItem("role", data.user.role);

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2>Login</h2>
      <form className="login-box" onSubmit={handleLogin}>
        <input
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="pw-input">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          <span onClick={() => setShowPassword((prev) => !prev)}>
            {showPassword ? (
              <i className="fa-solid fa-eye-slash"></i>
            ) : (
              <i className="fa-solid fa-eye"></i>
            )}
          </span>
        </div>

        <button type="submit" className="btn">
          Login
        </button>
      </form>
    </div>
  );
}
