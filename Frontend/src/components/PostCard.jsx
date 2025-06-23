import React from "react";
import {
  User,
  Heart,
  ThumbsDown,
  MessageSquare,
  Share2,
  MapPin,
  BarChart,
  UserPlus,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <div className="max-w-3xl w-full mx-auto bg-gray-800 border border-gray-700 text-white rounded-2xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between bg-gray-900 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r bg-blue-600 to-purple-600 flex items-center justify-center overflow-hidden ring-2 ring-white/10">
            {post.authorImage ? (
              <img
                src={post.authorImage}
                alt={post.author}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-white" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <div>
              <h4 className="text-white font-semibold text-base">
                {post.author}
              </h4>
              <p className="text-gray-400 text-xs">{post.timestamp}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <NavLink
            to="/feed/analytics"
            className="px-2 rounded-md py-1.5 bg-gray-800"
          >
            <BarChart className="h-4 w-4 text-blue-400" />
          </NavLink>
          {/* Follow Button */}
          <button className="flex items-center gap-1 text-white bg-blue-500 px-3 py-1.5 rounded-md text-sm sm:text-xs">
            {/* Only icon on mobile, full text on sm+ */}
            <UserPlus className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Follow</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4 bg-gray-800">
        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
        <div className="flex items-center w-full bg-gray-700 p-2 rounded-md justify-center text-gray-400 text-sm mb-2">
          <MapPin className="h-4 w-4 text-blue-400 mr-1" />
          <span>{post.location}</span>
        </div>
        <p className="text-gray-300 text-base leading-relaxed mb-4">
          {post.description}
        </p>

        {/* Image */}
        {post.images?.[0] && (
          <div className="overflow-hidden rounded-lg">
            <img
              src={post.images[0]}
              alt="Post"
              className="w-full h-64 object-cover"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-gray-700 bg-gray-900 text-sm">
        <div className="flex justify-between items-center text-gray-300">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4 text-red-500" />
            {post.likes}
          </div>
          <div className="flex items-center gap-1">
            <ThumbsDown className="h-4 w-4 text-orange-400" />
            {post.dislikes}
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4 text-blue-400" />
            {post.comments}
          </div>
          <div className="flex items-center gap-1 text-green-400">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
