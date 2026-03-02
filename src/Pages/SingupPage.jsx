import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../constants/constants";

const client = import.meta.env.VITE_CLIENT;

export default function SignupPage() {
  const [name, setName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BACKEND_URL}/auth/${client}/signup`, {
        name,
        restaurantName,
        email,
        password,
      });

      const data = res.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("restaurantName", data.user.restaurantName);
      localStorage.setItem("role", data.user.role);

      navigate("/verify", { state: { email } });
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Create Your Account</h2>

      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Restaurant Name"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div
          style={{
            position: "relative",
            display: "inline-block",
            width: "100%",
          }}
        >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}
