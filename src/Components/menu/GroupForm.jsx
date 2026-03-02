export default function GroupForm({
  groupDraftName,
  setGroupDraftName,
  onClose,
  onSave,
  isEditing,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="editing-target-title">
          {isEditing ? "Edit Group" : "Add Group"}
        </h2>

        <input
          value={groupDraftName}
          onChange={(e) => setGroupDraftName(e.target.value)}
          placeholder="Group Name"
          className="group-name-input"
        />

        <div className="action-buttons-container">
          <button onClick={onClose} className="cancel-btn">
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
