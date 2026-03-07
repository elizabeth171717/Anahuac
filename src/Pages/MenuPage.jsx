import { useEffect, useState } from "react";
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

  // ⭐ MODAL STATE
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [draftSectionName, setDraftSectionName] = useState("");
  const [editingSectionId, setEditingSectionId] = useState(null);
  // ✅ FETCH MENU
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${BACKEND_URL}/api/${client}/menu`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMenu(res.data);
      } catch (err) {
        console.error("❌ Failed to load menu", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) return <p>Loading menu...</p>;
  if (!menu) return <p>No menu found</p>;

  // ✅ SAVE MENU (MASTER SAVE — KEEP THIS ONE)
  const saveMenu = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(`${BACKEND_URL}/api/${client}/menu`, menu, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
        menu.sections.push({
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

  return (
    <div className="page">
      <div className="menu-container">
        {/* RESTAURANT NAME */}
        <RestaurantNameEditor menu={menu} setMenu={setMenu} />

        {/* ADD SECTION BUTTON */}
        <button className="btn" type="button" onClick={handleAddSection}>
          <Plus className="icon plus-icon" />
          Add Section
        </button>

        {/* MASTER SAVE MENU BUTTON */}
        <button type="button" className=" btn save-menu-btn" onClick={saveMenu}>
          Save Menu
        </button>

        {/* SECTIONS */}
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
