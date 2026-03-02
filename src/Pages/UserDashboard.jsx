import UserNavbar from "../Components/UserNavbar/UserNavbar";
import MenuPage from "./MenuPage";

export default function Dashboard() {
  const name = localStorage.getItem("name");
  const restaurantName = localStorage.getItem("restaurantName");

  return (
    <div className="dashboard-container">
      <UserNavbar />
      <h1>Welcome , {name} 👋</h1>
      <p>
        Ready to build the menu for <strong>{restaurantName}</strong>?
      </p>
      <div>
        <MenuPage />
      </div>
    </div>
  );
}
