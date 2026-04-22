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

const client = import.meta.env.VITE_CLIENT;

const MenuPage = () => {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [originalMenu, setOriginalMenu] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  // ⭐ MODAL STATE
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

  return (
    <div className="page">
      <div className="menu-container">
        {/* RESTAURANT NAME */}
        <div className="menu-name-container">
          <RestaurantNameEditor menu={menu} setMenu={setMenu} />
 
 {/* ADD SECTION BUTTON */}
          <button className="btn btn-primary" type="button" onClick={handleAddSection}>
            <Plus className="icon plus-icon" />
           
            {t("menuEditor.addSection")}
          </button>
        </div>
        {/* MASTER SAVE MENU BUTTON */}

        {hasChanges && (
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
    </div>
  );
};

export default MenuPage;
