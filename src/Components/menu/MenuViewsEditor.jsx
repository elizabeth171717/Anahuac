import { useState } from "react";
import { Pencil } from "lucide-react";

import MenuViewsForm from "./MenuViewsForm";

function MenuViewsEditor({
  menu,
  setMenu,
}) {
  const [showViewsForm, setShowViewsForm] = useState(false);

  const [viewsDraft, setViewsDraft] = useState([]);

  const openViewsModal = () => {
    setViewsDraft(structuredClone(menu.views || []));
    setShowViewsForm(true);
  };

  const saveViews = () => {
    setMenu((prev) => ({
      ...prev,
      views: viewsDraft,
    }));

    setShowViewsForm(false);
  };

  return (
    <>
      <div className="menu-views-editor">
        <div className="menu-views-header">
          <h3>Menu Views</h3>

          <Pencil
            className="icon edit-icon"
            onClick={openViewsModal}
          />
        </div>

        <div className="menu-views-preview">
          {menu.views?.length > 0 ? (
            menu.views.map((view) => (
              <span
                key={view.id}
                className="menu-view-chip"
              >
                {view.name}
              </span>
            ))
          ) : (
            <p>No views yet</p>
          )}
        </div>
      </div>

      {showViewsForm && (
        <MenuViewsForm
          viewsDraft={viewsDraft}
          setViewsDraft={setViewsDraft}
          onClose={() => setShowViewsForm(false)}
          onSave={saveViews}
        />
      )}
    </>
  );
}

export default MenuViewsEditor;