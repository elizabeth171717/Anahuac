import React from "react";
import { BACKEND_URL } from "../../constants/constants";
// Determine the backend URL based on the environment
import { useTranslation } from "react-i18next";

const client = import.meta.env.VITE_CLIENT;
console.log("📦 Backend URL:", BACKEND_URL);
console.log("🏷️ Client tenant:", client);

const ItemForm = ({
  show,
  dishDraft,
  setDishDraft,
  editingTarget,
  onClose,
  onSave,
}) => {
  if (!show) return null;
const { t } = useTranslation();
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="editing-target-title">
         
            {editingTarget ? t("itemForm.editTitle") : t("itemForm.addTitle")}
        </h2>

        {/* NAME */}
        <input
          value={dishDraft.name}
          onChange={(e) =>
            setDishDraft((d) => ({ ...d, name: e.target.value }))
          }
          placeholder={t("itemForm.name")}
          className="item-name-input"
        />

        {/* DESCRIPTION */}
        <input
          value={dishDraft.description}
          onChange={(e) =>
            setDishDraft((d) => ({ ...d, description: e.target.value }))
          }
          placeholder={t("itemForm.description")}
          className="item-description-input"
        />

        {/* PRICE */}
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          value={dishDraft.price}
          onChange={(e) =>
            setDishDraft((d) => ({ ...d, price: e.target.value }))
          }
          placeholder={t("itemForm.price")}
          className="item-price-input"
        />

   
        {/* IMAGE */}
        <input
          type="file"
          accept="image/*"
          className="item-image-input"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Validate type
            if (!file.type.startsWith("image/")) {
              alert(t("itemForm.invalidImage"));
              return;
            }

            // Validate size (2MB)
            const maxSize = 2 * 1024 * 1024;
            if (file.size > maxSize) {
              alert(t("itemForm.imageTooLarge"));
              return;
            }

            const formData = new FormData();
            formData.append("image", file);

            try {
              const response = await fetch(
                `${BACKEND_URL}/api/${client}/upload-image`,
                {
                  method: "POST",
                  body: formData,
                },
              );

              if (!response.ok) throw new Error("Upload failed");

              const data = await response.json();

              if (!data.url) throw new Error("No URL returned");

              // ✅ Save Cloudinary URL
              setDishDraft((d) => ({
                ...d,
                image: data.url,
              }));
            } catch (error) {
              console.error("Upload error:", error);
              alert(t("itemForm.uploadError"));
            }
          }}
        />

        {/* AVAILABLE */}
        <label className="available-checkbox">
          <input
            type="checkbox"
            checked={dishDraft.available}
            onChange={(e) =>
              setDishDraft((d) => ({
                ...d,
                available: e.target.checked,
              }))
            }
          />
          {t("itemForm.available")}
        </label>

        {/* VISIBLE */}
        <label className="visible-checkbox">
          <input
            type="checkbox"
            checked={dishDraft.visible}
            onChange={(e) =>
              setDishDraft((d) => ({
                ...d,
                visible: e.target.checked,
              }))
            }
          />
         {t("itemForm.visible")}
        </label>
       
<label className="item-label">{t("itemForm.remainingLabel")}</label>
<input
  type="number"
  min="0"
  value={dishDraft.remaining ?? ""}
  onChange={(e) => {
    const value = e.target.value;

    setDishDraft((d) => ({
      ...d,
      remaining: value === "" ? null : Number(value),
    }));
  }}
  placeholder={t("itemForm.remainingPlaceholder")}
  className="item-remaining-input"
/>

        {/* MODIFIERS */}
        <h3>{t("itemForm.modifiers")}</h3>

        {dishDraft.modifiers.map((mod, i) => (
          <div key={i} className="item-modifier-row">
            <input
              placeholder={t("itemForm.modifierName")}
              value={mod.name}
              onChange={(e) => {
                const copy = [...dishDraft.modifiers];
                copy[i].name = e.target.value;
                setDishDraft((d) => ({ ...d, modifiers: copy }));
              }}
              className="item-modifier-name-input"
            />

            <input
              placeholder={t("itemForm.modifierPrice")}
              value={mod.price}
              onChange={(e) => {
                const copy = [...dishDraft.modifiers];
                copy[i].price = Number(e.target.value);
                setDishDraft((d) => ({ ...d, modifiers: copy }));
              }}
              className="item-modifier-price-input"
            />
          </div>
        ))}

        <button
          onClick={() =>
            setDishDraft((d) => ({
              ...d,
              modifiers: [
                ...d.modifiers,
                { id: crypto.randomUUID(), name: "", price: 0 },
              ],
            }))
          }
          className="modifier-add-btn"
        >
        {t("itemForm.addModifier")}
        </button>

        {/* CUSTOM PROPERTIES */}
        <h3>{t("itemForm.customProperties")}</h3>

        {dishDraft.customProperties.map((prop, i) => (
          <div key={i} className="costume-property-row">
            <input
              placeholder={t("itemForm.propertyKey")}
              value={prop.key}
              onChange={(e) => {
                const copy = [...dishDraft.customProperties];
                copy[i].key = e.target.value;
                setDishDraft((d) => ({
                  ...d,
                  customProperties: copy,
                }));
              }}
              className="item-custom-property-key-input"
            />

            <input
              placeholder={t("itemForm.propertyValue")}
              value={prop.value}
              onChange={(e) => {
                const copy = [...dishDraft.customProperties];
                copy[i].value = e.target.value;
                setDishDraft((d) => ({
                  ...d,
                  customProperties: copy,
                }));
              }}
              className="item-custom-property-value-input"
            />
          </div>
        ))}

        <button
          onClick={() =>
            setDishDraft((d) => ({
              ...d,
              customProperties: [...d.customProperties, { key: "", value: "" }],
            }))
          }
          className="custom-property-add-btn"
        >
        {t("itemForm.addProperty")}
        </button>



{/* TAG SELECTOR */}
<h3>{t("itemForm.tags")}</h3>

<div className="tags-selector">
  {[
    { label: "vegan", icon: "🌱" },
    { label: "spicy", icon: "🌶️" },
    { label: "mild", icon: "🟢" },
    { label: "nuts", icon: "🥜" },
    { label: "dairy", icon: "🥛" },
  ].map((tag) => {
    const tags = dishDraft.tags || []; // ✅ SAFE
    const isActive = tags.includes(tag.label);

    return (
      <button
        key={tag.label}
        type="button"
        onClick={() => {
          setDishDraft((d) => {
            const currentTags = d.tags || []; // ✅ SAFE
            const exists = currentTags.includes(tag.label);

            return {
              ...d,
              tags: exists
                ? currentTags.filter((t) => t !== tag.label)
                : [...currentTags, tag.label],
            };
          });
        }}
        className={`tag-chip ${isActive ? "active" : ""}`}
      >
        <span>{tag.icon}</span> {tag.label}
      </button>
    );
  })}
</div>

        {/* ACTIONS */}
        <div className="action-buttons-container">
          <button onClick={onClose} className="cancel-btn">
            {t("itemForm.cancel")}
          </button>

          <button onClick={onSave} className="save-btn">
            {t("itemForm.save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemForm;
