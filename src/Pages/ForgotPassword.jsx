import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../constants/constants";
import { useTranslation } from "react-i18next";
const client = import.meta.env.VITE_CLIENT;

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { t } = useTranslation();
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        `${BACKEND_URL}/auth/${client}/forgot-password`,
        { email }
      );

      setMessage(
        res.data.message ||
          t("forgotPassword.successMessage")
      );

      setEmail("");
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
            t("forgotPassword.errorMessage")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
    
      <h2>{t("forgotPassword.title")}</h2>

      <p>{t("forgotPassword.description")}</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder={t("forgotPassword.emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" className="btn" disabled={loading}>
           {loading
    ? t("forgotPassword.sending")
    : t("forgotPassword.sendButton")}
        </button>
      </form>

      {message && (
        <p className="forgot-password-message">
          {message}
        </p>
      )}

      <p>
         {t("forgotPassword.remembered")}{" "}
  <Link to="/login">
    {t("forgotPassword.backToLogin")}
  </Link>
      </p>
    </div>
  );
}

export default ForgotPassword;