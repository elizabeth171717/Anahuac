import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Pencil } from "lucide-react"; // nice icons
import "./UserNavbar.css"; // make sure to create this CSS file for styling
export default function UserNavbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); // or wherever your login route is
  };
  return (
    <nav className="user-navbar">
      <div className="navbar-left" onClick={() => navigate("/user")}>
        ANAHUAC
      </div>

      <div className="navbar-right">
        <User className="user-icon" onClick={() => setOpen(!open)} />

        {open && (
          <div className="profile-menu">
            <div onClick={() => navigate("/editAccount")}>Edit Account</div>

            <div onClick={handleLogout}>Logout</div>
          </div>
        )}
      </div>
    </nav>
  );
}
