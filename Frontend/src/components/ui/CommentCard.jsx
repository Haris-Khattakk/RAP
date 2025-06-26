import React from "react";
import { User, Heart, ThumbsDown, CornerUpRight } from "lucide-react";

const CommentCard = ({ comment, onReply, depth = 0 }) => {
  return (
    <div className="space-y-2">
      {/* Avatar + Comment Box */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white">
          {comment.avatar ? (
            <img
              src={comment.avatar}
              alt={comment.name}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <User className="w-5 h-5" />
          )}
        </div>

        {/* Comment Box */}
        <div className="bg-gray-800 px-4 py-3 rounded-2xl flex-1">
          <p className="text-sm font-semibold text-white">{comment.name}</p>
          <p className="text-sm text-gray-300 mt-1">{comment.text}</p>

          {/* Comment Images */}
          {comment.images && comment.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {comment.images.map((image, index) => (
                <div
                  key={index}
                  className="rounded-lg overflow-hidden w-24 h-24"
                >
                  <img
                    src={image}
                    alt={`Comment attachment ${index}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div
        className={`flex items-center gap-4 text-xs text-gray-400 ${
          depth > 0 ? "pl-14" : "pl-14"
        }`}
      >
        <span>{comment.time}</span>
        <button className="flex items-center gap-1 hover:text-white transition">
          <Heart className="w-4 h-4" />
          <span>{comment.likes}</span>
        </button>
        <button className="flex items-center gap-1 hover:text-white transition">
          <ThumbsDown className="w-4 h-4" />
          <span>{comment.dislikes}</span>
        </button>
        <button
          onClick={onReply}
          className="flex items-center gap-1 hover:text-white transition"
        >
          <CornerUpRight className="w-4 h-4" />
          <span>Reply</span>
        </button>
      </div>
    </div>
  );
};

export default CommentCard;
