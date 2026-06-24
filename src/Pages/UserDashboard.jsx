import UserNavbar from "../Components/UserNavbar/UserNavbar";
import MenuPage from "./MenuPage";

export default function Dashboard() {
  const name = localStorage.getItem("name");
 
  return (
    <div className="user-dashboard-page">
      <UserNavbar />

     
      <div className="menu-page-div">
       <MenuPage/>
      </div>
    </div>
  );
}
