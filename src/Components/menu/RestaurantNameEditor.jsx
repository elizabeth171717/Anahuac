import { useState } from "react";
import { Pencil } from "lucide-react";

const RestaurantNameEditor = ({ menu, setMenu }) => {
  const [editing, setEditing] = useState(false);

  return (
    <div className="restaurant-name-editor">
      {editing ? (
        <input
          autoFocus
          className="restaurant-name-input"
          value={menu.restaurantName}
          onChange={(e) =>
            setMenu((prev) => ({
              ...prev,
              restaurantName: e.target.value,
            }))
          }
          onBlur={() => setEditing(false)}
          onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
        />
      ) : (
        <>
          <div className="restaurant-title-container">
            <h1 className="restaurant-name">{menu.restaurantName} </h1>

            <Pencil className="pencil-icon" onClick={() => setEditing(true)} />
          </div>
        </>
      )}
    </div>
  );
};

export default RestaurantNameEditor;
