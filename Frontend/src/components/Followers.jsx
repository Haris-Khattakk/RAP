import React from "react";
import { MessageCircleMore, MoreVertical } from "lucide-react";

const dummyFollowers = [
  { id: 1, name: "Ali", image: "https://i.pravatar.cc/150?img=11" },
  { id: 2, name: "Zara", image: "https://i.pravatar.cc/150?img=12" },
];

const Followers = ({ users = dummyFollowers }) => {
  return (
    <div className="grid gap-5">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between bg-gray-900 border border-[#333] p-4 rounded-2xl hover:bg-gray-700 transition-all"
        >
          {/* Left: Profile image and name */}
          <div className="flex items-center gap-4">
            <img
              src={user.image}
              alt={user.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#444]"
            />
            <div>
              <h3 className="text-white font-semibold text-base sm:text-lg">
                {user.name}
              </h3>
              <p className="text-gray-400 text-sm">Active 2h ago</p>
            </div>
          </div>

          {/* Right: Message & More */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 bg-white text-black px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-gray-200 transition">
              <MessageCircleMore size={16} />
              Message
            </button>
            <button className="text-gray-400 hover:text-white transition">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Followers;
