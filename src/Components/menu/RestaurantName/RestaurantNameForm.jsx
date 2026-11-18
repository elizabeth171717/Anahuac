
import { useTranslation } from "react-i18next";
import "../Modal.css";

export default function RestaurantNameForm({
  draftRestaurantName,
  setDraftRestaurantName,
  draftMenuDescription,
  setDraftMenuDescription,
  onCancel,
  onSave,
}) {
  const { t } = useTranslation();

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        <h2 className="editing-target-title">
          Edit Restaurant
        </h2>

        <h3>Restaurant Name</h3>

        <input
          type="text"
          value={draftRestaurantName}
          onChange={(e) =>
            setDraftRestaurantName(e.target.value)
          }
          placeholder="Restaurant name"
          className="restaurant-name-input"
        />

        <h3>Restaurant Description</h3>

        <textarea
          value={draftMenuDescription}
          onChange={(e) =>
            setDraftMenuDescription(e.target.value)
          }
          placeholder="Describe your restaurant..."
          className="menu-description-input"
          rows={4}
        />

        <div className="action-buttons-container">

          <button
            type="button"
            onClick={onCancel}
            className="cancel-btn"
          >
            {t("sectionForm.cancel")}
          </button>

          <button
            type="button"
            onClick={onSave}
            className="save-btn"
          >
            {t("sectionForm.save")}
          </button>

        </div>

      </div>
    </div>
  );
}
