
import { Pencil } from "lucide-react";

const RestaurantName = ({
  menu,
  isOwner,
  onEditRestaurant,
}) => {
  return (
    <div className="restaurant-name-editor">

      <div className="restaurant-name-container">
        <h1 className="restaurant-name">
          {menu.restaurantName}
        </h1>

        {isOwner && (
          <Pencil
            className="icon pencil-icon"
            onClick={onEditRestaurant}
          />
        )}
      </div>

      {menu.menuDescription && (
        <p className="menu-description">
          {menu.menuDescription}
        </p>
      )}

    </div>
  );
};

export default RestaurantName;
