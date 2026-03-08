import UserNavbar from "../Components/UserNavbar/UserNavbar";
import MenuPage from "./MenuPage";

export default function Dashboard() {
  const name = localStorage.getItem("name");
  const restaurantName = localStorage.getItem("restaurantName");

  return (
    <div className="user-dashboard-page">
      <UserNavbar />
      <div className="welcome-msg">
        <h2>Welcome , {name} 👋</h2>

        <p>
          Ready to build the menu for <strong>{restaurantName}</strong>?
        </p>
      </div>
      <div className="menu-page-div">
        <MenuPage />
      </div>
    </div>
  );
}
