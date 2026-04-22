import { useTranslation } from "react-i18next";

export default function GroupForm({
  groupDraftName,
  setGroupDraftName,
  onClose,
  onSave,
  isEditing,
}) {

  const { t } = useTranslation();
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="editing-target-title">
        
          {isEditing ? t("groupForm.editTitle") : t("groupForm.addTitle")}
        </h2>

        <input
          value={groupDraftName}
          onChange={(e) => setGroupDraftName(e.target.value)}
          placeholder={t("groupForm.name")}
          className="group-name-input"
        />

        <div className="action-buttons-container">
          <button onClick={onClose} className="cancel-btn">
           {t("groupForm.cancel")}
          </button>

          <button onClick={onSave} className="save-btn">
            {t("groupForm.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
