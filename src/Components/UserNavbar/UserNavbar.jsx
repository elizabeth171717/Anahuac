import { useNavigate } from "react-router-dom";
import { User, Pencil } from "lucide-react"; // nice icons
import "./UserNavbar.css"; // make sure to create this CSS file for styling
export default function UserNavbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); // or wherever your login route is
  };
  return (
    <nav className="user-navbar">
      <div className="navbar-left" onClick={() => navigate("/user")}>
        UNIVERSAL MENU
      </div>

      <div
        className="navbar-right"
        onClick={() => navigate("/editAccount")}
        title="Edit Account"
      >
        <User size={22} />
        {/* you can swap <User /> for <Pencil /> */}
      </div>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}
