import React, { useState } from "react";
import {
  Home,
  Compass,
  Plus,
  Search,
  MessageCircle,
  Bell,
  User,
  Menu,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { CreatePostForm } from "./index";

const Navbar = () => {
  const [showPostModal, setShowPostModal] = useState(false);

  return (
    <>
      {/* Top Navbar */}
      <nav className="w-full bg-black sticky top-0 text-white px-4 py-2 shadow flex items-center justify-between">
        <div className="text-lg font-semibold">RateAProperty</div>

        {/* Center Tabs */}
        <div className="md:flex hidden items-center gap-2 bg-gray-900 p-1 rounded-xl">
          <NavLink
            to="/feed/home"
            className={({ isActive }) =>
              `flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium ${
                isActive ? "bg-blue-600 text-white" : "bg-gray-800 text-white"
              }`
            }
          >
            <Home className="w-4 h-4" />
            Home
          </NavLink>
          <NavLink
            to="/feed/discover"
            className={({ isActive }) =>
              `flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium ${
                isActive ? "bg-blue-600 text-white" : "bg-gray-800 text-white"
              }`
            }
          >
            <Compass className="w-4 h-4" />
            Discover
          </NavLink>
          <button
            onClick={() => setShowPostModal(true)}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            New Post
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center bg-gray-800 px-3 py-2 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 transition">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none text-sm placeholder-gray-400 text-white w-32 sm:w-48"
            />
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center gap-4">
            <button title="Messages" className="text-gray-300 hover:text-white">
              <MessageCircle className="w-5 h-5" />
            </button>
            <button
              title="Notifications"
              className="relative text-gray-300 hover:text-white"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-black"></span>
            </button>
            <NavLink
              to="/feed/profile"
              title="Profile"
              className="text-gray-300 hover:text-white"
            >
              <User className="w-5 h-5" />
            </NavLink>
          </div>

          {/* Mobile Icons */}
          <div className="md:hidden flex items-center gap-4">
            <button title="Search" className="text-gray-300 hover:text-white">
              <Search className="w-5 h-5" />
            </button>
            <button title="Messages" className="text-gray-300 hover:text-white">
              <MessageCircle className="w-5 h-5" />
            </button>
            <button title="Menu" className="text-gray-300 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 p-2 flex justify-around items-center border-t border-gray-700 z-50">
        <NavLink
          to="/feed/home"
          className={({ isActive }) =>
            `flex flex-col items-center px-2 py-1 text-xs ${
              isActive ? "text-blue-500" : "text-gray-400"
            }`
          }
        >
          <Home className="w-5 h-5 mb-1" />
          Home
        </NavLink>
        <NavLink
          to="/feed/discover"
          className={({ isActive }) =>
            `flex flex-col items-center px-2 py-1 text-xs ${
              isActive ? "text-blue-500" : "text-gray-400"
            }`
          }
        >
          <Compass className="w-5 h-5 mb-1" />
          Discover
        </NavLink>
        <button
          onClick={() => setShowPostModal(true)}
          className="flex flex-col items-center px-2 py-1 text-xs text-gray-400"
        >
          <Plus className="w-5 h-5 mb-1" />
          New
        </button>
        <button className="flex flex-col items-center px-2 py-1 text-xs text-gray-400">
          <Bell className="w-5 h-5 mb-1" />
          Notification
        </button>
        <NavLink
          to="/feed/profile"
          className="flex flex-col items-center px-2 py-1 text-xs text-gray-400"
        >
          <User className="w-5 h-5 mb-1" />
          Profile
        </NavLink>
      </div>

      {/* Create Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white max-w-xl w-full mx-4 sm:mx-0 p-6 rounded-xl shadow-lg relative">
            <button
              onClick={() => setShowPostModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Pass the function to close the modal */}
            <CreatePostForm onClose={() => setShowPostModal(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
