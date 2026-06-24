import React from "react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import "./MenuViewsForm.css";

const MenuViewsForm = ({
  show,
  viewsDraft,
  setViewsDraft,
  editingTarget,
  onClose,
  onSave,
}) => {
  const { t } = useTranslation();
const [newViewName, setNewViewName] =
  useState("");
  if (!show) return null;

  // DEFAULT SAMPLE VIEWS
 const starterViews = [
  {
    id: "website",
    name: t("menuViews.defaultViews.website"),
  },
  {
    id: "pos",
    name: t("menuViews.defaultViews.pos"),
  },
  {
    id: "kiosk",
    name: t("menuViews.defaultViews.kiosk"),
  },
];

  // TOGGLE BUILT-IN VIEW
  const toggleView = (view) => {
    const exists = viewsDraft.some((v) => v.id === view.id);

    if (exists) {
      setViewsDraft((prev) =>
        prev.filter((v) => v.id !== view.id)
      );
    } else {
      setViewsDraft((prev) => [...prev, view]);
    }
  };

  // ADD CUSTOM VIEW
  const addCustomView = () => {
  if (!newViewName.trim()) return;

  const newView = {
    id: crypto.randomUUID(),
    name: newViewName,
  };

  setViewsDraft((prev) => [
    ...prev,
    newView,
  ]);

  setNewViewName("");
};

 return (
  <div className="modal-overlay">
    <div className="modal-content">

      <h2 className="editing-target-title">
        {t("menuViews.title")}
      </h2>

      {/* YOUR VIEWS */}
      <h3 className="menu-views-subtitle">
        {t("menuViews.yourViews")}
      </h3>

      <div className="menu-views-list">
        {viewsDraft.map((view) => {
          const isStarter =
            starterViews.some(
              (starter) => starter.id === view.id
            );

          return (
            <div
              key={view.id}
              className="custom-view-row"
            >
              <input
                value={view.name}
                onChange={(e) =>
                  setViewsDraft((prev) =>
                    prev.map((v) =>
                      v.id === view.id
                        ? {
                            ...v,
                            name: e.target.value,
                          }
                        : v
                    )
                  )
                }
              />

              <button
                type="button"
                
                onClick={() =>
                  setViewsDraft((prev) =>
                    prev.filter(
                      (v) => v.id !== view.id
                    )
                  )
                }
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {/* ADD NEW VIEW */}
      <h3 className="menu-views-subtitle">
        {t("menuViews.addAnotherView")}
      </h3>

      <input
        type="text"
        placeholder={t("menuViews.newViewPlaceholder")}
        value={newViewName}
        onChange={(e) =>
          setNewViewName(e.target.value)
        }
        className="new-view-input"
      />

      <button
        type="button"
        className=" btn add-custom-view-btn"
        onClick={addCustomView}
      >
        + {t("menuViews.addCustom")}
      </button>

      {/* ACTIONS */}
      <div className="action-buttons-container">
        <button
          onClick={onClose}
          className="cancel-btn"
        >
          {t("itemForm.cancel")}
        </button>

        <button
          onClick={onSave}
          className="save-btn"
        >
          {t("itemForm.save")}
        </button>
      </div>

    </div>
  </div>
);
};

export default MenuViewsForm;