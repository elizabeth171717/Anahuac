import { Trash2, Copy, Pencil } from "lucide-react";
import "./ItemCard.css";

const ItemCard = ({
  item,
  sectionId,
  groupId = null,
  setMenu,
  openEditDish,
}) => {
  // DELETE
  const handleDelete = () => {
    setMenu((prev) => {
      const menu = structuredClone(prev);
      const section = menu.sections.find((s) => s.id === sectionId);
      if (!section) return prev;

      if (groupId) {
        const group = section.groups.find((g) => g.id === groupId);
        if (!group) return prev;

        group.items = group.items.filter((i) => i.id !== item.id);
      } else {
        section.items = section.items.filter((i) => i.id !== item.id);
      }

      return menu;
    });
  };

  // DUPLICATE
  const handleDuplicate = () => {
    setMenu((prev) => {
      const menu = structuredClone(prev);
      const section = menu.sections.find((s) => s.id === sectionId);
      if (!section) return prev;

      const newItem = {
        ...structuredClone(item),
        id: crypto.randomUUID(),
        name: item.name + " (Copy)",
      };

      if (groupId) {
        const group = section.groups.find((g) => g.id === groupId);
        if (!group) return prev;
        group.items.push(newItem);
      } else {
        section.items.push(newItem);
      }

      return menu;
    });
  };

  return (
    <div className="menu-item-card">
      {/* ACTIONS */}
      <div className="icons-container">
        <Pencil
          className="edit"
          onClick={() => openEditDish(sectionId, groupId, item.id)}
        />
        <Copy className="duplicate" onClick={handleDuplicate} />
        <Trash2 className="delete" onClick={handleDelete} />
      </div>
      {/* IMAGE */}
      {item.image && (
        <img src={item.image} alt={item.name} className="item-image" />
      )}
      <div className="card-details">
        {/* NAME */}
        <div className="name-price">
          <h3 className="item-name">{item.name}</h3> {/* PRICE */}
          <p className="item-price">${item.price}</p>
        </div>
        {/* DESCRIPTION */}
        {item.description && (
          <p className="item-description">{item.description}</p>
        )}
        {/* AVAILABILITY */}
        <p
          className={`text-sm ${item.available ? "text-green-600" : "text-red-500"}`}
        >
          {item.available ? "Available" : "Not Available"}
        </p>
        {/* VISIBILITY */}
        {item.visible !== undefined && (
          <p className="visibility">
            {item.visible ? "Visible to Customers" : "Hidden from Customers"}
          </p>
        )}
        {/* MODIFIERS */}
        {item.modifiers && item.modifiers.length > 0 && (
          <div className="modifiers-section">
            <p className="modifiers">Modifiers:</p>
            <ul className="modifiers-list">
              {item.modifiers.map((mod, index) => (
                <li key={index}>
                  {mod.name} - ${mod.price}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* CUSTOM PROPERTIES */}
        {item.customProperties?.length > 0 && (
          <div className="custom-properties-section">
            <p className="property">Custom Properties:</p>
            <ul className="property-list">
              {item.customProperties.map((prop, index) => (
                <li key={index}>
                  {prop.key}: {prop.value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
