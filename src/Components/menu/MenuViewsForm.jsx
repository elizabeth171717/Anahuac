import { useTranslation } from "react-i18next";
import "./MenuViewsForm.css";

function MenuViewsForm({
  viewsDraft,
  setViewsDraft,
  onClose,
  onSave,
}) {
  const { t } = useTranslation();

  // ✅ DEFAULT VIEWS
  const defaultViews = [
    {
      id: "website",
      name: "Website",
    },
    {
      id: "pos",
      name: "POS",
    },
    {
      id: "kiosk",
      name: "Self-Service Kiosk",
    },
  ];

  // ✅ TOGGLE VIEW
  const toggleView = (view) => {
    const exists = viewsDraft.some((v) => v.id === view.id);

    if (exists) {
      setViewsDraft((prev) => prev.filter((v) => v.id !== view.id));
    } else {
      setViewsDraft((prev) => [...prev, view]);
    }
  };

  // ✅ ADD CUSTOM VIEW
  const addCustomView = () => {
    const name = prompt("Enter custom view name");

    if (!name?.trim()) return;

    const newView = {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
    };

    setViewsDraft((prev) => [...prev, newView]);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="editing-target-title">
          {t("menuViews.title")}
        </h2>

        <div className="menu-views-list">
          {defaultViews.map((view) => {
            const checked = viewsDraft.some((v) => v.id === view.id);

            return (
              <label key={view.id} className="menu-view-checkbox">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleView(view)}
                />

                {view.name}
              </label>
            );
          })}
        </div>

        {/* CUSTOM VIEWS */}
        {viewsDraft
          .filter(
            (v) =>
              !defaultViews.some((defaultView) => defaultView.id === v.id)
          )
          .map((view) => (
            <div key={view.id} className="custom-view-row">
              <span>{view.name}</span>

              <button
                type="button"
                className="remove-custom-view-btn"
                onClick={() =>
                  setViewsDraft((prev) =>
                    prev.filter((v) => v.id !== view.id)
                  )
                }
              >
                ✕
              </button>
            </div>
          ))}

        <button
          type="button"
          className="add-custom-view-btn"
          onClick={addCustomView}
        >
          + {t("menuViews.addCustomView")}
        </button>

        {/* ACTIONS */}
        <div className="action-buttons-container">
          <button onClick={onClose} className="cancel-btn">
            {t("menuViews.cancel")}
          </button>

          <button onClick={onSave} className="save-btn">
            {t("menuViews.save")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuViewsForm;