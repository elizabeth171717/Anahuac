import { Trash2, Copy, Pencil, Eye, EyeOff } from "lucide-react";
import "./ItemCard.css";

const ItemCard = ({
  item,
  sectionId,
  groupId = null,
  setMenu,
  openEditDish,
}) => {
 // 👇 ADD IT HERE
  const isTracked =
    item.remaining !== null && item.remaining !== undefined;

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

  const toggleVisibility = () => {
    setMenu((prev) => {
      const menu = structuredClone(prev);
      const section = menu.sections.find((s) => s.id === sectionId);
      if (!section) return prev;

      let itemToUpdate;

      if (groupId) {
        const group = section.groups.find((g) => g.id === groupId);
        if (!group) return prev;

        itemToUpdate = group.items.find((i) => i.id === item.id);
      } else {
        itemToUpdate = section.items.find((i) => i.id === item.id);
      }

      if (!itemToUpdate) return prev;

      itemToUpdate.visible = !itemToUpdate.visible;

      return menu;
    });
  };

  const toggleAvailability = () => {
  setMenu((prev) => {
    const menu = structuredClone(prev);
    const section = menu.sections.find((s) => s.id === sectionId);
    if (!section) return prev;

    let itemToUpdate;

    if (groupId) {
      const group = section.groups.find((g) => g.id === groupId);
      if (!group) return prev;

      itemToUpdate = group.items.find((i) => i.id === item.id);
    } else {
      itemToUpdate = section.items.find((i) => i.id === item.id);
    }

    if (!itemToUpdate) return prev;

    itemToUpdate.available = !itemToUpdate.available;

    return menu;
  });
};

  const price = Number(item.price);

  const modifiers = item.modifiers?.filter((m) => m.name || m.price) || [];

  const properties =
    item.customProperties?.filter((p) => p.key && p.value) || [];

  const modifierPrices = modifiers
    .map((m) => Number(m.price))
    .filter((p) => p > 0);

  const minModifierPrice =
    modifierPrices.length > 0 ? Math.min(...modifierPrices) : null;

  return (
    <div className="menu-item-card">
      {/* ACTIONS */}
      <div className="icons-container">
       
        <Copy className="icon duplicate-icon" onClick={handleDuplicate} />

        {/* VISIBILITY TOGGLE */}
        {item.visible ? (
          <Eye className="icon visibility-icon" onClick={toggleVisibility} />
        ) : (
          <EyeOff
            className="icon visibility-icon hidden-icon"
            onClick={toggleVisibility}
          />
        )}

        <Trash2 className="icon trash-icon" onClick={handleDelete} />
         <Pencil
          className="icon edit-icon"
          onClick={() => openEditDish(sectionId, groupId, item.id)}
        />
      </div>
      {/* IMAGE */}
      {item.image && (
        <img src={item.image} alt={item.name} className="item-image" />
      )}
      <div className="card-details">
        {/* NAME & PRICE*/}
        <div className="name-price">
          <p className="item-price">
            {price > 0 && `$${price}`}

            {!price && minModifierPrice && `From $${minModifierPrice}`}
          </p>

          <p className="item-name">{item.name}</p>
        </div>
        {/* DESCRIPTION */}
        {item.description && (
          <p className="item-description">{item.description}</p>
        )}
        {/* AVAILABILITY */}
        <p onClick={toggleAvailability}
          className={`avialability ${item.available ? "text-green-600" : "text-red-500"}`}
        >
          {item.available ? "Available" : "Not Available"}
        </p>
{/* 🔥 REMAINIG DISPLAY */}

{isTracked && (
  item.remaining === 0 ? (
    <p>❌ Sold Out</p>
  ) : item.remaining <= 5 ? (
    <p className="text-orange-500 font-bold">
      ⚠️ Only {item.remaining} left
    </p>
  ) : (
    <p>{item.remaining} left</p>
  )
)}

        {/* MODIFIERS */}
        {modifiers.length > 0 && (
          <div className="modifiers-section">
            <p className="modifiers">Modifiers:</p>

            <ul className="modifiers-list">
              {modifiers.map((mod, index) => (
                <li key={index}>
                  {mod.name}
                  {mod.price && ` - $${mod.price}`}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* CUSTOM PROPERTIES */}
        {properties.length > 0 && (
          <div className="custom-properties-section">
            <p className="property">Custom Properties:</p>

            <ul className="property-list">
              {properties.map((prop, index) => (
                <li key={index}>
                  {prop.key}: {prop.value}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* TAGS */}
{(() => {
  const tags = item.tags || []; // ✅ SAFE

  if (tags.length === 0) return null;

  const tagMap = {
    vegan: "🌱",
    spicy: "🌶️",
    mild: "🟢",
    nuts: "🥜",
    dairy: "🥛",
  };

  return (
    <div className="item-tags">
      {tags.map((tag) =>
        tagMap[tag] ? (
          <span key={tag}>{tagMap[tag]}</span>
        ) : null
      )}
    </div>
  );
})()}
      </div>
    </div>
  );
};

export default ItemCard;
