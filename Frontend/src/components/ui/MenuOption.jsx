import React from "react";

const MenuOption = ({
  currentUser,
  postId,
  onEdit,
  onReport,
  onDelete,
  editText,
  reportText,
  deleteText,
}) => {
  return (
    <div className="relative">
      {/* Arrow pointing to 3-dots */}
      <div className="absolute -top-1.5 right-2 w-3 h-3 bg-gray-700 rotate-45"></div>

      {/* Menu box */}
      <div className="w-40 bg-gray-700 rounded-md shadow-xl p-2 text-sm text-white space-y-1">
        {currentUser?.id !== postId ? (
          <button
            onClick={onReport}
            className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-600 transition"
          >
            Report {reportText}
          </button>
        ) : (
          <>
            <button
              onClick={onEdit}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-600 transition"
            >
              Edit {editText}
            </button>
            <button
              onClick={onDelete}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-red-600 transition text-white"
            >
              Delete {deleteText}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MenuOption;
