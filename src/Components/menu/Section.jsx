import {
  Trash2,
  Copy,
  Plus,
  Pencil,
  ChevronDown,
  ChevronRight,
  GripVertical,
} from "lucide-react";
import { useState } from "react";

import Group from "./Group";
import ItemCard from "./ItemCard";
import ItemForm from "./ItemForm";
import GroupForm from "./GroupForm";
import "./Modal.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Section = ({ section, setMenu, onEditSection }) => {
  const safeGroups = section.groups || [];
  const safeItems = section.items || [];
  const [collapsed, setCollapsed] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [groupDraftName, setGroupDraftName] = useState("");

  const [showDishForm, setShowDishForm] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  // ✅ EXACT SAME STATE STRUCTURE AS GROUP
  const [dishDraft, setDishDraft] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    available: true,
    visible: true,
    modifiers: [],
    customProperties: [],
   
     remaining: 0, // ✅ ADD THIS
        tags: [] // ✅ ADD THIS
  });

  const [editingTarget, setEditingTarget] = useState(null);

  // ---------------- DELETE SECTION ----------------
  const handleDeleteSection = () => {
    setMenu((prev) => {
      const menu = structuredClone(prev);
      menu.sections = menu.sections.filter((s) => s.id !== section.id);
      return menu;
    });
  };

  // ---------------- DUPLICATE SECTION ----------------
  const handleDuplicateSection = () => {
    setMenu((prev) => {
      const menu = structuredClone(prev);
      const newSection = structuredClone(section);

      newSection.id = crypto.randomUUID();
      newSection.sectionName += " (Copy)";

      newSection.items = (newSection.items || []).map((item) => ({
        ...structuredClone(item),
        id: crypto.randomUUID(),
      }));

      newSection.groups = (newSection.groups || []).map((group) => ({
        ...structuredClone(group),
        id: crypto.randomUUID(),
        items: (group.items || []).map((item) => ({
          ...structuredClone(item),
          id: crypto.randomUUID(),
        })),
      }));

      menu.sections.push(newSection);
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
     
       remaining: 0, // ✅ ADD THIS
        tags: [] // ✅ ADD THIS
    });
    setShowDishForm(true);
  };

  // ---------------- OPEN EDIT DISH ----------------
  const openEditDish = (itemId) => {
    const itemToEdit = section.items.find((i) => i.id === itemId);
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
      const sectionToUpdate = menu.sections.find((s) => s.id === section.id);
      if (!sectionToUpdate) return prev;

      if (!sectionToUpdate.items) sectionToUpdate.items = [];

      // 🔥 EDIT MODE (EXACT SAME STRUCTURE AS GROUP)
      if (editingTarget) {
        sectionToUpdate.items = sectionToUpdate.items.map((item) =>
          item.id === editingTarget.itemId
            ? { ...cleanDish(dishDraft), id: editingTarget.itemId }
            : item,
        );
      }

      // 🔥 CREATE MODE (EXACT SAME STRUCTURE AS GROUP)
      else {
        const cleanedDish = cleanDish(dishDraft);

        const newDish = {
          id: crypto.randomUUID(),
          ...cleanedDish,
        };

        sectionToUpdate.items.unshift(newDish);
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
       remaining: 0, // ✅ ADD THIS
        tags: [] // ✅ ADD THIS
    });

    setEditingTarget(null);
    setShowDishForm(false);
  };

  // ---------------- ADD GROUP (UNCHANGED) ----------------
  const saveGroup = () => {
    if (!groupDraftName.trim()) return;

    setMenu((prev) => {
      const menu = structuredClone(prev);
      const s = menu.sections.find((sec) => sec.id === section.id);
      if (!s) return prev;

      if (editingGroupId) {
        s.groups = s.groups.map((g) =>
          g.id === editingGroupId ? { ...g, groupName: groupDraftName } : g,
        );
      } else {
        if (!s.groups) s.groups = [];

        s.groups.unshift({
          id: crypto.randomUUID(),
          groupName: groupDraftName,
          items: [],
        });
      }

      return menu;
    });

    setGroupDraftName("");
    setEditingGroupId(null);
    setShowGroupForm(false);
  };

  return (
    <div ref={setNodeRef} style={style} className="menu-section">
      <div className="section-tittle-wrapper">
        <div className="title-container">
          <span className="drag-handle" {...attributes} {...listeners}>
            <GripVertical className="icon drag-icon" />
          </span>
          <h2>{section.section}</h2>
        </div>

        <div className="icons">
          <Pencil
            className="icon edit-icon"
            onClick={() => onEditSection(section)}
          />
          <Copy
            className="icon duplicate-icon"
            onClick={handleDuplicateSection}
          />
          <Trash2 className="icon trash-icon" onClick={handleDeleteSection} />
          <button
            className="icon collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight /> : <ChevronDown />}
          </button>
        </div>

        <div className="btns-container">
          <div className="add-dish">
            <button className="btn" onClick={handleAddDish}>
              <Plus className="icon add-icon" /> Item
            </button>
          </div>

          <div className="add-group">
            <button
              className="btn"
              onClick={() => {
                setGroupDraftName("");
                setEditingGroupId(null);
                setShowGroupForm(true);
              }}
            >
              <Plus className="icon add-icon" /> Group
            </button>
          </div>
        </div>
      </div>

      {!collapsed && (
        <>
          {safeGroups.map((group) => (
            <Group
              key={group.id}
              sectionId={section.id}
              group={group}
              setMenu={setMenu}
              onEditGroup={(group) => {
                setGroupDraftName(group.groupName);
                setEditingGroupId(group.id);
                setShowGroupForm(true);
              }}
            />
          ))}

          <div className="menu-items-grid">
            {safeItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                sectionId={section.id}
                setMenu={setMenu}
                openEditDish={() => openEditDish(item.id)}
              />
            ))}
          </div>
        </>
      )}

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

      {showGroupForm && (
        <GroupForm
          groupDraftName={groupDraftName}
          setGroupDraftName={setGroupDraftName}
          onClose={() => {
            setShowGroupForm(false);
            setEditingGroupId(null);
            setGroupDraftName("");
          }}
          onSave={saveGroup}
          isEditing={!!editingGroupId}
        />
      )}
    </div>
  );
};

export default Section;
