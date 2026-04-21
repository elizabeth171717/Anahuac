import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../constants/constants";
import { useTranslation } from "react-i18next";
const client = import.meta.env.VITE_CLIENT;

export default function SignupPage() {
  const [name, setName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const { t } = useTranslation();
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
    <div className="signup-container">
      <button className="btn back-btn" onClick={() => navigate("/")}>
        
          ← {t("signup.back")}
      </button>
      <h2>{t("signup.title")}</h2>

      <form className="signup-box" onSubmit={handleSignup}>
        <input
          type="text"
          placeholder={t("signup.name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder={t("signup.restaurantName")}
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder={t("signup.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="pw-input">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={t("signup.password")}
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
        <button type="submit" className="btn">
       
            {t("signup.submit")}
        </button>
      </form>
    </div>
  );
}
