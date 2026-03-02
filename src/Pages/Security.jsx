import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../constants/constants";

export default function Security() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChange = async () => {
    const token = localStorage.getItem("token");
    const client = "anahuac";

    try {
      await axios.put(
        `${BACKEND_URL}/auth/${client}/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: token } },
      );

      alert("Password updated!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div>
      <h2>Security Settings 🔒</h2>

      <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <button onClick={handleChange}>Change Password</button>
    </div>
  );
}
