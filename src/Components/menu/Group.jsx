import { useState } from "react";
import { Trash2, Copy, Plus, Pencil } from "lucide-react";
import ItemCard from "./ItemCard";
import ItemForm from "./ItemForm";

const Group = ({ sectionId, group, setMenu, onEditGroup }) => {
  const safeItems = group.items || [];

  const [showDishForm, setShowDishForm] = useState(false);

  const [dishDraft, setDishDraft] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    available: true,
    visible: true,
    modifiers: [],
    customProperties: [],
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
      price: "",
      image: "",
      available: true,
      visible: true,
      modifiers: [],
      customProperties: [],
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
    return {
      ...dish,
      price: dish.price && Number(dish.price) > 0 ? Number(dish.price) : "",
      modifiers: (dish.modifiers || [])
        .filter((m) => m.name || m.price)
        .map((m) => ({
          ...m,
          price: m.price && Number(m.price) > 0 ? Number(m.price) : "",
        })),
      customProperties: (dish.customProperties || []).filter(
        (p) => p.key && p.value,
      ),
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
      price: "",
      image: "",
      available: true,
      visible: true,
      modifiers: [],
      customProperties: [],
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
              Dish
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
        />
      )}
    </>
  );
};

export default Group;
