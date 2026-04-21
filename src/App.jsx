import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./i18n";
import { Routes, Route } from "react-router-dom";
import Login from "./Pages/LoginPage";
import AdminDashboard from "./Pages/AdminDashboard";
import UserDashboard from "./Pages/UserDashboard";
import Security from "./Pages/Security";
import LandingPage from "./Pages/LandingPage";
import SignupPage from "./Pages/SingupPage";

import VerifyAccount from "./Pages/VerifyAccountPage";
import EditAccountPage from "./Pages/EditAccountPage";
import "./App.css";
import "./styles/forms.css";
import "./styles/buttons.css";
import "./styles/icons.css";
function App() {
    const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/user" element={<UserDashboard />} />
      <Route path="/security" element={<Security />} />

      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify" element={<VerifyAccount />} />
      <Route path="/editAccount" element={<EditAccountPage />} />
    </Routes>
  );
}

export default App;
