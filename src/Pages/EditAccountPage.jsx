import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../constants/constants";
import UserNavbar from "../Components/UserNavbar/UserNavbar";
import { useTranslation } from "react-i18next";
const client = import.meta.env.VITE_CLIENT;

/* ================= FIELD ROW COMPONENT ================= */
function FieldRow({
  label,
  field,
  user,
  editingField,
  setEditingField,
  value,
  setValue,
  handleSave,
  type = "text",
}) {
  const isEditing = editingField === field;

  return (
    <div className="field-row">
      <strong>{label}:</strong>

      {isEditing ? (
        <>
          <input
            type={type}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button onClick={() => handleSave(field)}>Save</button>
          <button onClick={() => setEditingField(null)}>Cancel</button>
        </>
      ) : (
        <>
          <span>{field === "password" ? "******" : user?.[field]}</span>
          <button
            className="icon-btn"
            onClick={() => {
              setEditingField(field);
              setValue(user?.[field] || "");
            }}
          >
            ✏️
          </button>
        </>
      )}
    </div>
  );
}

/* ================= MAIN PAGE ================= */
export default function EditAccountPage() {
  const [user, setUser] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [value, setValue] = useState("");
  const { t } = useTranslation(); // ✅ ADD THIS LINE
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/auth/${client}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        console.error("Failed to load user");
      }
    };

    if (token) fetchUser();
  }, [token]);

  const handleSave = async (field) => {
    try {
      await axios.put(
        `${BACKEND_URL}/auth/${client}/account`,
        { [field]: value },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setUser((prev) => ({ ...prev, [field]: value }));
      setEditingField(null);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="account-container">
      <UserNavbar />
      <h2>{t("account.title")}</h2>

      {user ? (
        <>
          <FieldRow
            label={t("account.name")}
            field="name"
            user={user}
            editingField={editingField}
            setEditingField={setEditingField}
            value={value}
            setValue={setValue}
            handleSave={handleSave}
          />

          <FieldRow
            label={t("account.email")}
            field="email"
            type="email"
            user={user}
            editingField={editingField}
            setEditingField={setEditingField}
            value={value}
            setValue={setValue}
            handleSave={handleSave}
          />

          <FieldRow
            label={t("account.password")}
            field="password"
            type="password"
            user={user}
            editingField={editingField}
            setEditingField={setEditingField}
            value={value}
            setValue={setValue}
            handleSave={handleSave}
          />

          <FieldRow
            label={t("account.restaurant")}
            field="restaurantName"
            user={user}
            editingField={editingField}
            setEditingField={setEditingField}
            value={value}
            setValue={setValue}
            handleSave={handleSave}
          />
        </>
      ) : (
        <p>{t("account.loading")}</p>
      )}
    </div>
  );
}
