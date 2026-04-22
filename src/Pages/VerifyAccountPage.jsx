import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../constants/constants";
import { useLocation, useNavigate } from "react-router-dom";
import UserNavbar from "../Components/UserNavbar/UserNavbar";
const client = import.meta.env.VITE_CLIENT;

export default function VerifyAccountPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email] = useState(location.state?.email || "");

  const [step, setStep] = useState("choice"); // choice | code
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  // 📩 Step 1 — User chooses VERIFY NOW
  const handleRequestCode = async () => {
    try {
      await axios.post(`${BACKEND_URL}/auth/${client}/request-verification`, {
        email,
      });

      setMessage("📩 Verification code sent to your email.");
      setStep("code");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not send code.");
    }
  };

  // 🔐 Step 2 — User submits code
  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${BACKEND_URL}/auth/${client}/verify`, {
        email,
        code,
      });

      setMessage("✅ Email verified! Redirecting...");
      setTimeout(() => navigate("/user"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Verification failed");
    }
  };

  // ⏭ Skip verification
  const handleSkip = () => {
    navigate("/user");
  };

  return (
    <div className="verify-page">
      <UserNavbar/>
<div className="verify-container">
      <h2>Verify Your Account</h2>

      <p className="verify-email">
        Account: <strong>{email}</strong>
      </p>

      {step === "choice" && (
        <div className="action-buttons-container">
          <button onClick={handleRequestCode} className="btn">Verify Now</button>
          <button onClick={handleSkip} className="btn skip-btn">
            Skip for Now
          </button>
        </div>
      )}

      {step === "code" && (
        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter confirmation code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button className="btn" type="submit">Confirm Code</button>
        </form>
      )}

      {message && <p>{message}</p>}
      </div>
    </div>
  );
}
