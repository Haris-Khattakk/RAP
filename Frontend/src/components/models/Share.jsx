import React from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  X,
  Send,
  Globe,
} from "lucide-react";

const Share = ({ shareUrl, onClose }) => {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    } catch {
      alert("Failed to copy the link.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white w-full max-w-md mx-4 rounded-xl shadow-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Share this Post
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Share via social media or copy the link
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-blue-600 hover:scale-105 transition"
          >
            <Facebook />
            <span className="text-xs mt-1">Facebook</span>
          </a>

          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-blue-400 hover:scale-105 transition"
          >
            <Twitter />
            <span className="text-xs mt-1">Twitter</span>
          </a>

          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-blue-700 hover:scale-105 transition"
          >
            <Linkedin />
            <span className="text-xs mt-1">LinkedIn</span>
          </a>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-green-500 hover:scale-105 transition"
          >
            <Send />
            <span className="text-xs mt-1">WhatsApp</span>
          </a>

          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center text-gray-700 hover:scale-105 transition"
          >
            <Copy />
            <span className="text-xs mt-1">Copy Link</span>
          </button>

          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-purple-600 hover:scale-105 transition"
          >
            <Globe />
            <span className="text-xs mt-1">Open Link</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Share;
