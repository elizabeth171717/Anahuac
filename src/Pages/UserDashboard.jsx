import UserNavbar from "../Components/UserNavbar/UserNavbar";
import MenuPage from "./MenuPage";

export default function Dashboard() {
  const name = localStorage.getItem("name");
 
  return (
    <div className="user-dashboard-page">
      <UserNavbar />


        <div className="welcome-msg">
          <h2>Welcome, {name} 👋</h2>
        </div>
      


     
      <div className="menu-page-div">
       <MenuPage/>
      </div>
    </div>
  );
}
