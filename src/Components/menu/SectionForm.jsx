export default function SectionForm({
  draftSectionName,
  setDraftSectionName,
  onCancel,
  onSave,
  isEditing,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="editing-target-title">
          {isEditing ? "Edit Section" : "Add Section"}
        </h2>

        <input
          value={draftSectionName}
          onChange={(e) => setDraftSectionName(e.target.value)}
          placeholder="Section Name"
          className="section-name-input"
        />

        <div className="action-buttons-container">
          <button onClick={onCancel} className="cancel-btn">
            Cancel
          </button>

          <button onClick={onSave} className="save-btn">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
