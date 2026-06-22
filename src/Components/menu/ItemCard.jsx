import { Trash2, Copy, Pencil } from "lucide-react";
import "./ItemCard.css";
import { useTranslation } from "react-i18next";
const ItemCard = ({
  item,
  sectionId,
  groupId = null,
  setMenu,
  openEditDish,
  isOwner,
  views = [],
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


 const basePrice =
  item.basePrice !== null &&
  item.basePrice !== undefined
    ? Number(item.basePrice)
    : null;


  const modifiers = item.modifiers?.filter((m) => m.name || m.price) || [];

  const properties =
    item.customProperties?.filter((p) => p.key && p.value) || [];

 
    const variantPrices = modifiers
  .filter((m) => m.type === "variant")
  .map((m) => Number(m.price))
  .filter((p) => p > 0);

const minVariantPrice =
  variantPrices.length > 0
    ? Math.min(...variantPrices)
    : null;

 
console.log(item);
const addons = modifiers.filter(
  (m) => m.type === "addon"
);

const variants = modifiers.filter(
  (m) => m.type === "variant"
);
const { t } = useTranslation();
  return (
    <div className="menu-item-card">
      {/* ACTIONS */}
      <div className="icons-container">
          {isOwner && (
    <>
        <Copy className="icon duplicate-icon" onClick={handleDuplicate} />


        <Trash2 className="icon trash-icon" onClick={handleDelete} />
         <Pencil
          className="icon edit-icon"
          onClick={() => openEditDish(sectionId, groupId, item.id)}
        />
        </>
          )}
      </div>
      {/* IMAGE */}
      {item.image && (
        <img src={item.image} alt={item.name} className="item-image" />
      )}
      <div className="card-details">
        {/* NAME & PRICE*/}
        <div className="name-price">
        <p className="item-price">

  {/* BASE PRICE */}
  {basePrice !== null && (
    <>${basePrice.toFixed(2)}</>
    
  )}

  {/* VARIANT-ONLY ITEMS */}
  {basePrice === null &&
    minVariantPrice && (
      
      <>{t("itemCard.from")} ${Number(minVariantPrice).toFixed(2)}</>
    )}
</p>
          <p className="item-name">{item.name}</p>
        </div>
       
       {isOwner && (
        <div className="view-price-list">
{views.map((view) => {

    const overridePrice =
      item.prices?.[view.id];

    if (
      overridePrice === undefined ||
      overridePrice === null
    ) {
      return null;
    }

    return (
      <p
        key={view.id}
        className="view-price"
      >
        {view.name}: ${Number(overridePrice).toFixed(2)}
      </p>
    );
  })}
  
</div>
       )}
        
        {/* DESCRIPTION */}
        {item.description && (
          <p className="item-description">{item.description}</p>
        )}
        {/* VIEW STATUS */}
        {isOwner && (
<div className="view-status-container">
  {views.map((view) => {
  const settings = item.displaySettings?.[view.id] || {
  visible: true,
  available: true,
  remaining: null,
};

    return (
      <div key={view.id} className="view-status-card">
        <p className="view-name">{view.name}</p>

        <div className="view-status-info">
          <span>
            {settings.visible
  ? `👁️ ${t("itemCard.visible")}`
  : `🙈 ${t("itemCard.hidden")}`}
          </span>

          <span>
           {settings.available
  ? `✅ ${t("itemCard.available")}`
  : `❌ ${t("itemCard.unavailable")}`}
          </span>

          {settings.remaining !== null && (
            <span>
             📦 {settings.remaining} {t("itemCard.left")}
            </span>
          )}
        </div>
      </div>
    );
  })}
</div>
        )}
        {/* MODIFIERS */}
       {/* VARIANTS */}
{variants.length > 0 && (
  <div className="modifiers-section">
  
<p className="modifiers">
  {t("itemCard.variants")}:
</p>
    <ul className="modifiers-list">
      {variants.map((mod, index) => (
        <li key={index}>
          {mod.name}
          {mod.price && ` - $${Number(mod.price).toFixed(2)}`}
        </li>
      ))}
    </ul>
  </div>
)}

{/* ADDONS */}
{addons.length > 0 && (
  <div className="modifiers-section">
   
<p className="modifiers">
  {t("itemCard.addons")}:
</p>
    <ul className="modifiers-list">
      {addons.map((mod, index) => (
        <li key={index}>
          {mod.name}
          {mod.price && ` - $${Number(mod.price).toFixed(2)}`}
        </li>
      ))}
    </ul>
  </div>
)}
        {/* CUSTOM PROPERTIES */}
        {properties.length > 0 && (
          <div className="custom-properties-section">
          
<p className="property">
  {t("itemCard.customProperties")}:
</p>
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
