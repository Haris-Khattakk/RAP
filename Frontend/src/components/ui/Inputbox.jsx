import React, { useState, useRef } from "react";
import { User, Image as ImageIcon, X } from "lucide-react";

const Inputbox = ({ onPost, autoFocus = false, onCancel }) => {
  const [commentText, setCommentText] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handlePost = () => {
    if (commentText.trim() || imageFiles.length > 0) {
      onPost(commentText, imagePreviews);
      setCommentText("");
      setImagePreviews([]);
      setImageFiles([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePost();
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImageFiles = [...imageFiles];
      const newImagePreviews = [...imagePreviews];

      files.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            newImagePreviews.push(reader.result);
            newImageFiles.push(file);

            // Update state after all images are processed
            if (
              newImagePreviews.length ===
              imagePreviews.length + files.length
            ) {
              setImagePreviews(newImagePreviews);
              setImageFiles(newImageFiles);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeImage = (index) => {
    const newImagePreviews = [...imagePreviews];
    const newImageFiles = [...imageFiles];

    newImagePreviews.splice(index, 1);
    newImageFiles.splice(index, 1);

    setImagePreviews(newImagePreviews);
    setImageFiles(newImageFiles);
  };

  return (
    <div className="w-full">
      {/* Images Preview */}
      {imagePreviews.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {imagePreviews.map((preview, index) => (
            <div
              key={index}
              className="relative rounded-lg overflow-hidden w-24 h-24"
            >
              <img
                src={preview}
                alt={`Preview ${index}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-gray-800/80 rounded-full p-1 hover:bg-gray-700"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 w-full">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white">
          <User className="w-5 h-5" />
        </div>

        {/* Input + icon */}
        <div className="relative z-10 flex-1">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a comment..."
            autoFocus={autoFocus}
            className="w-full px-4 py-2 pr-10 text-sm bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            multiple
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="absolute inset-y-0 right-2 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Post Button */}
        <div className="flex gap-2">
          <button
            onClick={handlePost}
            disabled={!commentText.trim() && imageFiles.length === 0}
            className={`px-4 py-2 text-sm text-white rounded-lg hover:opacity-90 transition ${
              commentText.trim() || imageFiles.length > 0
                ? "bg-blue-500"
                : "bg-blue-500/50 cursor-not-allowed"
            }`}
          >
            Post
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-3 py-2 text-sm text-gray-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inputbox;
