import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../constants/constants";

const client = import.meta.env.VITE_CLIENT;

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${BACKEND_URL}/api/${client}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("USERS:", res.data);
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Registered Users</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Restaurant</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name || "-"}</td>
              <td>{user.email}</td>
              <td>{user.restaurantName || "-"}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/security">
        <button>🔒 Change Password</button>
      </Link>
    </div>
  );
}
