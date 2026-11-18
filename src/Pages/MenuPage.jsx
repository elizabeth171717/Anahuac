import { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { useTranslation } from "react-i18next";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Plus, Pencil  } from "lucide-react";
import axios from "axios";
import SectionForm from "../Components/menu/SectionForm";
import { BACKEND_URL } from "../constants/constants";
import Section from "../Components/menu/Section";

import RestaurantName from "../Components/menu/RestaurantName/RestaurantName";
import RestaurantNameForm from "../Components/menu/RestaurantName/RestaurantNameForm";
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
// RESTAURANT MODAL
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const [draftRestaurantName, setDraftRestaurantName] = useState("");
  const [draftMenuDescription, setDraftMenuDescription] = useState("");
const [draftSectionDescription, setDraftSectionDescription] = useState("");
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

  
if (loading) return <p>{t("menuPage.loading")}</p>;
if (!menu) return <p>{t("menuPage.noMenu")}</p>;

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

 
 // OPEN RESTAURANT FORM
  const openRestaurantForm = () => {
    setDraftRestaurantName(menu.restaurantName || "");
    setDraftMenuDescription(menu.menuDescription || "");

    setShowRestaurantForm(true);
  };

  // SAVE RESTAURANT DRAFT TO MENU STATE
  const saveRestaurant = () => {
    if (!draftRestaurantName.trim()) return;

    setMenu((prev) => ({
      ...prev,
      restaurantName: draftRestaurantName.trim(),
      menuDescription: draftMenuDescription.trim(),
    }));

    setShowRestaurantForm(false);
  };

  const handleAddSection = () => {
    setDraftSectionName("");
    setDraftSectionDescription("");

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
      const index = menu.sections.findIndex(
        (s) => s.id === editingSectionId
      );

      if (index !== -1) {
        menu.sections[index].section = draftSectionName.trim();
        menu.sections[index].description = draftSectionDescription.trim();
      }
    } else {
      menu.sections.unshift({
        id: crypto.randomUUID(),
        section: draftSectionName.trim(),
        description: draftSectionDescription.trim(),
        items: [],
        groups: [],
      });
    }

    return menu;
  });

  setDraftSectionName("");
  setDraftSectionDescription("");
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
<div className="menu-page-header">
        <div className="view-toggle">
  <button
    className="btn"
    onClick={() =>
      setMode(isOwner ? "public" : "owner")
    }
  >
  
      {isOwner
  ? `👀 ${t("menuPage.previewMenu")}`
  : `✏️ ${t("menuPage.backToEditing")}`}
  </button>
</div>
{isOwner && (
  <button
    type="button"
    className="btn menu-views-button"
    onClick={openViewsModal}
  >
    {t("menuPage.menuViews")}
  </button>
)}
</div>
        {/* RESTAURANT NAME */}
        <div className="menu-name-container">
          {isOwner ? (
    <RestaurantName
      menu={menu}
      isOwner={isOwner}
      setMenu={setMenu}
      onEditRestaurant={openRestaurantForm}
    />
  ) : (
     <div className="restaurant-name-editor">
      <h1 className="restaurant-name">
        {menu.restaurantName}
      </h1>

      {menu.menuDescription && (
        <p className="menu-description">
          {menu.menuDescription}
        </p>
      )}
    </div>
  )}
  

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
{isOwner &&
  hasChanges &&
  !showSectionForm &&
  !showViewsForm && (
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
                  setDraftSectionDescription(section.description || "");
                  setEditingSectionId(section.id);
                  setShowSectionForm(true);
                }}

              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

       {/* RESTAURANT FORM */}
      {isOwner && showRestaurantForm && (
        <RestaurantNameForm
          draftRestaurantName={draftRestaurantName}
          setDraftRestaurantName={setDraftRestaurantName}
          draftMenuDescription={draftMenuDescription}
          setDraftMenuDescription={setDraftMenuDescription}
          onCancel={() => setShowRestaurantForm(false)}
          onSave={saveRestaurant}
        />
      )}

      {/* ⭐ SECTION CREATION MODAL ⭐ */}
      {showSectionForm && (
        <SectionForm
          draftSectionName={draftSectionName}
          setDraftSectionName={setDraftSectionName}
           draftSectionDescription={draftSectionDescription}
    setDraftSectionDescription={setDraftSectionDescription}
          onCancel={() => {
            setShowSectionForm(false);
            setEditingSectionId(null);
            setDraftSectionName("");
            setDraftSectionDescription("");
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
