import React from "react";

const DeleteModal = ({
  text,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white w-full max-w-sm mx-4 rounded-xl shadow-lg p-6 text-center">
        <p className="text-gray-800 text-lg mb-6">{text}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
