import { useTranslation } from "react-i18next";


export default function SectionForm({
  draftSectionName,
  setDraftSectionName,
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
