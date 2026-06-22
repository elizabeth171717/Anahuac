import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../constants/constants";

const client = import.meta.env.VITE_CLIENT;

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match.");
    }

    try {
      const res = await axios.post(
        `${BACKEND_URL}/auth/${client}/reset-password/${token}`,
        {
          newPassword,
        }
      );

      alert(res.data.message);

      navigate("/login");
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to reset password."
      );
    }
  };

  return (
    <div className="forgot-password-page">
      <h2>Choose a New Password</h2>

      <p>Enter your new password below.</p>

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button onClick={handleReset}
      type="button"
  className=" btn"
      >
        Reset Password
      </button>
    </div>
  );
}