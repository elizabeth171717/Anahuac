import { useState } from "react";
import { Trash2, Copy, Plus, Pencil } from "lucide-react";
import ItemCard from "./ItemCard";
import ItemForm from "./ItemForm";
import { useTranslation } from "react-i18next";
const Group = ({ sectionId, group, setMenu, onEditGroup,  views}) => {
  const safeItems = group.items || [];
const { t } = useTranslation();
  const [showDishForm, setShowDishForm] = useState(false);

  const [dishDraft, setDishDraft] = useState({
  name: "",
  description: "",

  basePrice: null,

  prices: {},

  image: "",

  displaySettings: {},

  modifiers: [],
  customProperties: [],
  tags: [],
  });

  const [editingTarget, setEditingTarget] = useState(null);

  // ---------------- DELETE GROUP ----------------
  const handleDeleteGroup = () => {
    setMenu((prev) => {
      const menu = structuredClone(prev);
      const section = menu.sections.find((s) => s.id === sectionId);
      if (!section) return prev;

      section.groups = (section.groups || []).filter((g) => g.id !== group.id);

      return menu;
    });
  };

  // ---------------- DUPLICATE GROUP ----------------
  const handleDuplicateGroup = () => {
    setMenu((prev) => {
      const menu = structuredClone(prev);
      const section = menu.sections.find((s) => s.id === sectionId);
      if (!section) return prev;

      const newGroup = structuredClone(group);

      newGroup.id = crypto.randomUUID();
      newGroup.groupName += " (Copy)";

      newGroup.items = (newGroup.items || []).map((item) => ({
        ...structuredClone(item),
        id: crypto.randomUUID(),
      }));

      section.groups.push(newGroup);
      return menu;
    });
  };

  // ---------------- OPEN CREATE DISH ----------------
  const handleAddDish = () => {
    setEditingTarget(null);
    setDishDraft({
     name: "",
  description: "",

  basePrice: null,

  prices: {},

  image: "",

  displaySettings: {},

  modifiers: [],
  customProperties: [],
  tags: [],
    });
    setShowDishForm(true);
  };

  // ---------------- OPEN EDIT DISH ----------------
  const openEditDish = (itemId) => {
    const itemToEdit = group.items.find((i) => i.id === itemId);
    if (!itemToEdit) return;

    setDishDraft(structuredClone(itemToEdit));
    setEditingTarget({ itemId });
    setShowDishForm(true);
  };

 // ---------------- CLEAN DISH ----------------
const cleanDish = (dish) => {
  // CLEAN VIEW PRICES
  const cleanedPrices = Object.fromEntries(
    Object.entries(dish.prices || {}).filter(
      ([, value]) =>
        value !== "" &&
        value !== null &&
        value !== undefined
    )
  );

  return {
    ...dish,

    // BASE PRICE
    basePrice:
      dish.basePrice === "" ||
      dish.basePrice === null ||
      dish.basePrice === undefined
        ? null
        : Number(dish.basePrice),

    // VIEW PRICES
    prices: cleanedPrices,

    // DISPLAY SETTINGS
    displaySettings: dish.displaySettings || {},

    // MODIFIERS
    modifiers: (dish.modifiers || [])
      .filter((m) => m.name || m.price)
      .map((m) => ({
        ...m,
        price:
          m.price === "" ||
          m.price === null ||
          m.price === undefined
            ? 0
            : Number(m.price),
      })),

    // CUSTOM PROPERTIES
    customProperties: (dish.customProperties || []).filter(
      (p) => p.key && p.value
    ),

    // TAGS
    tags: dish.tags || [],
  };
};

  // ---------------- CREATE OR EDIT DISH ----------------
  const createDish = () => {
    if (!dishDraft.name.trim()) return;

    setMenu((prev) => {
      const menu = structuredClone(prev);
      const section = menu.sections.find((s) => s.id === sectionId);
      if (!section) return prev;

      const groupToUpdate = section.groups.find((g) => g.id === group.id);
      if (!groupToUpdate) return prev;

      if (!groupToUpdate.items) groupToUpdate.items = [];

      // 🔥 EDIT MODE
      if (editingTarget) {
        groupToUpdate.items = groupToUpdate.items.map((item) =>
          item.id === editingTarget.itemId
            ? { ...cleanDish(dishDraft), id: editingTarget.itemId }
            : item,
        );
      }

      // 🔥 CREATE MODE
      else {
        const cleanedDish = cleanDish(dishDraft);

        const newDish = {
          id: crypto.randomUUID(),
          ...cleanedDish,
        };

        groupToUpdate.items.unshift(newDish);
      }

      return menu;
    });

    setDishDraft({
     name: "",
  description: "",

  basePrice: null,

  prices: {},

  image: "",

  displaySettings: {},

  modifiers: [],
  customProperties: [],
  tags: [],
    });

    setEditingTarget(null);
    setShowDishForm(false);
  };

  return (
    <>
      <div className="menu-group">
        {/* HEADER */}
        <div className="group-tittle-wrapper">
          <h3>{group.groupName}</h3>
          <div className="icons">
            <Pencil
              className="icon edit-icon"
              onClick={() => onEditGroup(group)}
            />
            <Copy
              className="icon duplicate-icon"
              onClick={handleDuplicateGroup}
            />

            <Trash2 className="icon trash-icon" onClick={handleDeleteGroup} />
          </div>
          <div className="add-dish">
            <button className="btn" onClick={handleAddDish}>
              <Plus className="icon add-icon" />
              {t("group.addItem")}
            </button>
          </div>
        </div>

        {/* ADD DISH */}

        <div className="menu-items-grid">
          {/* ITEMS */}
          {safeItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              sectionId={sectionId}
              groupId={group.id}
              setMenu={setMenu}
              openEditDish={() => openEditDish(item.id)}
                views={views}
            />
          ))}
        </div>
      </div>
      {/* ---------------- DISH MODAL ---------------- */}
      {showDishForm && (
        <ItemForm
          show={showDishForm}
          dishDraft={dishDraft}
          setDishDraft={setDishDraft}
          editingTarget={editingTarget}
          onClose={() => setShowDishForm(false)}
          onSave={createDish}
            views={views}
        />
      )}
    </>
  );
};

export default Group;
