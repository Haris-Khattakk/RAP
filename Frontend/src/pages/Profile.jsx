import React, { useState } from "react";
import { Grid3X3, Users, UserCheck } from "lucide-react";
import { PostCard, Followers } from "../components/index";

const dummyPosts = [
  { id: 1, image: "https://source.unsplash.com/random/300x300?sig=1" },
  { id: 2, image: "https://source.unsplash.com/random/300x300?sig=2" },
  { id: 3, image: "https://source.unsplash.com/random/300x300?sig=3" },
  { id: 4, image: "https://source.unsplash.com/random/300x300?sig=4" },
];

const dummyFollowers = [
  { id: 1, name: "Ali", image: "https://i.pravatar.cc/150?img=11" },
  { id: 2, name: "Zara", image: "https://i.pravatar.cc/150?img=12" },
];

const dummyFollowing = [
  { id: 1, name: "Usman", image: "https://i.pravatar.cc/150?img=14" },
  { id: 2, name: "Hira", image: "https://i.pravatar.cc/150?img=15" },
];

export default function ProfileSection() {
  const [activeTab, setActiveTab] = useState("following");

  return (
    <div className="w-full bg-gray-600 py-4 min-h-screen">
      <div className="max-w-3xl mx-auto rounded-md px-4 py-6 bg-gray-800 text-[#f1f1f1]">
        {/* Top Info */}
        <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between gap-6">
          <img
            src="https://i.pravatar.cc/150?img=5"
            className="w-28 h-28 rounded-full object-cover border-4 border-gray-700 shadow-md"
            alt="Profile"
          />
          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-2xl font-bold">hariskhan_</h1>
            <p className="text-sm text-[#aaa]">
              Web Developer | Love to build UIs | React & Tailwind
            </p>
            <div className="flex gap-3 justify-center md:justify-start mt-3">
              <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition">
                Follow
              </button>
              <button className="border border-gray-500 px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-700 transition">
                Message
              </button>
            </div>
          </div>
        </div>

        {/* Stats Counter Section */}
        <div className="flex justify-around text-center mt-8 mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {dummyPosts.length}
            </h2>
            <p className="text-sm text-gray-400">Posts</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              {dummyFollowers.length}
            </h2>
            <p className="text-sm text-gray-400">Followers</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              {dummyFollowing.length}
            </h2>
            <p className="text-sm text-gray-400">Following</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-around mt-4 border-b border-gray-700">
          {[
            { name: "posts", label: "Posts", icon: <Grid3X3 size={16} /> },
            {
              name: "followers",
              label: "Followers",
              icon: <Users size={16} />,
            },
            {
              name: "following",
              label: "Following",
              icon: <UserCheck size={16} />,
            },
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`py-3 w-full text-sm font-medium flex items-center justify-center gap-1 ${
                activeTab === tab.name
                  ? "border-b-2 border-white text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "posts" && <PostCard posts={dummyPosts} />}
          {activeTab === "followers" && <Followers users={dummyFollowers} />}
          {activeTab === "following" && <Followers users={dummyFollowing} />}
        </div>
      </div>
    </div>
  );
}
