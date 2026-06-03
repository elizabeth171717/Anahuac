import { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { useTranslation } from "react-i18next";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import axios from "axios";
import SectionForm from "../Components/menu/SectionForm";
import { BACKEND_URL } from "../constants/constants";
import Section from "../Components/menu/Section";
import RestaurantNameEditor from "../Components/menu/RestaurantNameEditor";
import MenuViewsForm from "../Components/menu/MenuViewsForm";

const client = import.meta.env.VITE_CLIENT;

const MenuPage = () => {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [originalMenu, setOriginalMenu] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  // ⭐ MODAL STATE
  const [showViewsForm, setShowViewsForm] =
  useState(false);
  const [mode, setMode] = useState("owner");

const isOwner = mode === "owner";
const [viewsDraft, setViewsDraft] =
  useState([]);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [draftSectionName, setDraftSectionName] = useState("");
  const [editingSectionId, setEditingSectionId] = useState(null);

  const { t } = useTranslation();
  // ✅ FETCH MENU
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${BACKEND_URL}/api/${client}/menu`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMenu(res.data);
        setOriginalMenu(structuredClone(res.data));
      } catch (err) {
        console.error("❌ Failed to load menu", err);
      } finally {
        setLoading(false);
      }

    };

    fetchMenu();
    
  }, []);

  useEffect(() => {
    if (!menu || !originalMenu) return;

    const changed = JSON.stringify(menu) !== JSON.stringify(originalMenu);
    setHasChanges(changed);
  }, [menu, originalMenu]);

  if (loading) return <p>Loading menu...</p>;
  if (!menu) return <p>No menu found</p>;

  // ✅ SAVE MENU (MASTER SAVE — KEEP THIS ONE)
  const saveMenu = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(`${BACKEND_URL}/api/${client}/menu`, menu, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOriginalMenu(structuredClone(menu));
      console.log("✅ MENU SAVED");
    } catch (err) {
      console.error("❌ SAVE ERROR:", err.response?.data || err.message);
    }
  };

  // ✅ OPEN MODAL


// ✅ OPEN VIEWS MODAL
const openViewsModal = () => {
  setViewsDraft(
    structuredClone(menu.views || [])
  );

  setShowViewsForm(true);
};

// ✅ SAVE VIEWS
const saveViews = () => {
  setMenu((prev) => ({
    ...prev,
    views: viewsDraft,
  }));

  setShowViewsForm(false);
};

  const handleAddSection = () => {
    setDraftSectionName("");
    setEditingSectionId(null);
    setShowSectionForm(true);
  };

  // ✅ CREATE SECTION FROM MODAL
  const createSection = () => {
    if (!draftSectionName.trim()) return;

    setMenu((prev) => {
      const menu = structuredClone(prev);

      if (!menu.sections) menu.sections = [];

      if (editingSectionId) {
        // EDIT MODE
        const index = menu.sections.findIndex((s) => s.id === editingSectionId);

        if (index !== -1) {
          menu.sections[index].section = draftSectionName;
        }
      } else {
        // CREATE MODE
        menu.sections.unshift({
          id: crypto.randomUUID(),
          section: draftSectionName,
          items: [],
          groups: [],
        });
      }

      return menu;
    });

    setDraftSectionName("");
    setEditingSectionId(null);
    setShowSectionForm(false);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setMenu((prev) => {
      const menu = structuredClone(prev);

      const oldIndex = menu.sections.findIndex((s) => s.id === active.id);
      const newIndex = menu.sections.findIndex((s) => s.id === over.id);

      menu.sections = arrayMove(menu.sections, oldIndex, newIndex);

      return menu;
    });
  };
console.log("MENU VIEWS IN RENDER:", menu.views);
  return (
    <div className="page">
      <div className="menu-container">

        <div className="view-toggle">
  <button
    className="btn"
    onClick={() =>
      setMode(isOwner ? "public" : "owner")
    }
  >
    {isOwner
      ? "👀 Preview Menu"
      : "✏️ Back To Editing"}
  </button>
</div>
        {/* RESTAURANT NAME */}
        <div className="menu-name-container">
          {isOwner ? (
  <RestaurantNameEditor
    menu={menu}
    setMenu={setMenu}
  />
  
) : (
  <h1>{menu.restaurantName}</h1>
)}
<div className="menu-views-editor">
  <div className="menu-views-header">
    <h3>Menu Views</h3>

   

    {isOwner && (
  <button
    type="button"
    onClick={openViewsModal}
  >
    Edit Views
  </button>
)}
  </div>

  <div className="menu-views-preview">
    {menu.views?.length > 0 ? (
      menu.views.map((view) => (
        <span
          key={view.id}
          className="menu-view-chip"
        >
          {view.name}
        </span>
      ))
    ) : (
      <p>No views yet</p>
    )}
  </div>
</div>

 {/* ADD SECTION BUTTON */}
       {isOwner && (
  <button
    className="btn btn-primary"
    type="button"
    onClick={handleAddSection}
  >
    <Plus className="icon plus-icon" />
    {t("menuEditor.addSection")}
  </button>
)}
        </div>
        {/* MASTER SAVE MENU BUTTON */}
{isOwner && hasChanges && (
  <button
    type="button"
    className="btn save-menu-btn"
    onClick={saveMenu}
  >
    {t("menuEditor.saveMenu")}
  </button>
)}


        {/* SECTIONS */}
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={menu.sections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {menu.sections?.map((section) => (
              <Section
                key={section.id}
                section={section}
                setMenu={setMenu}
                 views={menu.views}
                  isOwner={isOwner}
                onEditSection={(section) => {
                  setDraftSectionName(section.section);
                  setEditingSectionId(section.id);
                  setShowSectionForm(true);
                }}

              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* ⭐ SECTION CREATION MODAL ⭐ */}
      {showSectionForm && (
        <SectionForm
          draftSectionName={draftSectionName}
          setDraftSectionName={setDraftSectionName}
          onCancel={() => {
            setShowSectionForm(false);
            setEditingSectionId(null);
            setDraftSectionName("");
          }}
          onSave={createSection}
          isEditing={!!editingSectionId}
        />
      )}
  {isOwner && showViewsForm && (
  <MenuViewsForm
    show={showViewsForm}
    viewsDraft={viewsDraft}
    setViewsDraft={setViewsDraft}
    onClose={() =>
      setShowViewsForm(false)
    }
    onSave={saveViews}
  />
)}
  
      </div>
  );
};

export default MenuPage;
