import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-card">
        <h1>Welcome to Universal Menu</h1>
        <p>Manage your restaurant menu from one place.</p>

        <div className="landing-buttons">
          <button onClick={() => navigate("/login")}>Login</button>

          <button onClick={() => navigate("/signup")}>Create Account</button>
        </div>
      </div>
    </div>
  );
}
