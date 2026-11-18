import { useTranslation } from "react-i18next";


export default function SectionForm({
  draftSectionName,
  setDraftSectionName,
   draftSectionDescription,
  setDraftSectionDescription,
  onCancel,
  onSave,
  isEditing,
}) 
{const { t } = useTranslation();
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="editing-target-title">
         
          {isEditing ? t("sectionForm.editTitle") : t("sectionForm.addTitle")}
        </h2>

        <input
          value={draftSectionName}
          onChange={(e) => setDraftSectionName(e.target.value)}
          placeholder={t("sectionForm.name")}
          className="section-name-input"
        />

         <textarea
          value={draftSectionDescription}
          onChange={(e) => setDraftSectionDescription(e.target.value)}
          placeholder="Section description..."
          className="menu-description-input"
          rows={3}
        />

        <div className="action-buttons-container">
          <button onClick={onCancel} className="cancel-btn">
            {t("sectionForm.cancel")}
          </button>

          <button onClick={onSave} className="save-btn">
          {t("sectionForm.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
