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
   views = [],
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
      <div className="pricing-section">
  <h3>Pricing</h3>

  {/* BASE PRICE */}
  <div className="price-row">
    <label>Base Price</label>

    <input
      type="number"
      value={dishDraft.basePrice ?? ""}
      onChange={(e) => {
        const value = e.target.value;

        setDishDraft((prev) => ({
          ...prev,
          basePrice:
            value === ""
              ? null
              : Number(value),
        }));
      }}
    />
  </div>

  {/* VIEW-SPECIFIC PRICES */}
  {views.map((view) => (
    <div key={view.id} className="price-row">
      <label>
        {view.name} Price Override
      </label>

      <input
        type="number"
        value={dishDraft.prices?.[view.id] ?? ""}
        placeholder="Uses base price"
        onChange={(e) => {
          const value = e.target.value;

          setDishDraft((prev) => ({
            ...prev,

            prices: {
              ...prev.prices,

              [view.id]:
                value === ""
                  ? undefined
                  : Number(value),
            },
          }));
        }}
      />
    </div>
  ))}
</div>

   
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
{/* VIEW SETTINGS */}
<h3>{t("itemForm.viewSettings")}</h3>

<div className="view-settings-container">
  {views.map((view) => {
    const settings = dishDraft.displaySettings?.[view.id] || {
      visible: true,
      available: true,
      remaining: null,
    };

    return (
      <div key={view.id} className="view-setting-card">
        <h4>{view.name}</h4>

        {/* AVAILABLE */}
        <label className="available-checkbox">
          <input
            type="checkbox"
            checked={settings.available}
            onChange={(e) =>
              setDishDraft((d) => ({
                ...d,
                displaySettings: {
                  ...d.displaySettings,
                  [view.id]: {
                    ...settings,
                    available: e.target.checked,
                  },
                },
              }))
            }
          />
          {t("itemForm.available")}
        </label>

        {/* VISIBLE */}
        <label className="visible-checkbox">
          <input
            type="checkbox"
            checked={settings.visible}
            onChange={(e) =>
              setDishDraft((d) => ({
                ...d,
                displaySettings: {
                  ...d.displaySettings,
                  [view.id]: {
                    ...settings,
                    visible: e.target.checked,
                  },
                },
              }))
            }
          />
          {t("itemForm.visible")}
        </label>

        {/* REMAINING */}
        <label className="item-label">
          {t("itemForm.remainingLabel")}
        </label>

        <input
          type="number"
          min="0"
          value={settings.remaining ?? ""}
          onChange={(e) => {
            const value = e.target.value;

            setDishDraft((d) => ({
              ...d,
              displaySettings: {
                ...d.displaySettings,
                [view.id]: {
                  ...settings,
                  remaining:
                    value === "" ? null : Number(value),
                },
              },
            }));
          }}
          placeholder={t("itemForm.remainingPlaceholder")}
          className="item-remaining-input"
        />
      </div>
    );
  })}
</div>
{/* MODIFIERS */}
<h3>{t("itemForm.modifiers")}</h3>

{dishDraft.modifiers.map((mod, i) => (
  <div key={i} className="item-modifier-row">

    {/* MODIFIER NAME */}
    <input
      placeholder={t("itemForm.modifierName")}
      value={mod.name}
      onChange={(e) => {
        const copy = [...dishDraft.modifiers];

        copy[i].name = e.target.value;

        setDishDraft((d) => ({
          ...d,
          modifiers: copy,
        }));
      }}
      className="item-modifier-name-input"
    />

    {/* MODIFIER PRICE */}
    <input
      type="number"
      placeholder={t("itemForm.modifierPrice")}
      value={mod.price}
      onChange={(e) => {
        const copy = [...dishDraft.modifiers];

        copy[i].price = Number(e.target.value);

        setDishDraft((d) => ({
          ...d,
          modifiers: copy,
        }));
      }}
      className="item-modifier-price-input"
    />

    {/* MODIFIER TYPE */}
    <select
      value={mod.type || "addon"}
      onChange={(e) => {
        const copy = [...dishDraft.modifiers];

        copy[i].type = e.target.value;

        setDishDraft((d) => ({
          ...d,
          modifiers: copy,
        }));
      }}
      className="modifier-type-select"
    >
      <option value="addon">
        Addon
      </option>

      <option value="variant">
        Variant
      </option>
    </select>

  </div>
))}

<button
  onClick={() =>
    setDishDraft((d) => ({
      ...d,
      modifiers: [
        ...d.modifiers,
        {
          id: crypto.randomUUID(),
          name: "",
          price: 0,
          type: "addon",
        },
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

    {/* PROPERTY KEY */}
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

    {/* PROPERTY VALUE */}
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
      customProperties: [
        ...d.customProperties,
        {
          key: "",
          value: "",
        },
      ],
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
