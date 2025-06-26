import React, { useState } from "react";
import { MessageCircleMore, MoreVertical, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFollowMutation } from "../react-query/follow&unfollowMutation";

const Followers = ({ users = [], currentUser }) => {
  const navigate = useNavigate();

  const handleNavtoProfile = (profileId) => {
    navigate("/feed/profile", {
      state: { profileId, currentUser },
    });
  };
  const [selectedUser, setSelectedUser] = useState({})

  // mutation for follow/unfollow
  const { mutate: followMutate } = useFollowMutation({
    followers: selectedUser?.followers,
  });
  const handleFollow = (user) => {
    setSelectedUser(user)
    followMutate({
      follower: currentUser?.id,
      follow: user?._id,
    });
  };

  return (
    <div className="grid gap-5">
      {users?.map((user, index) => (
        <div
          onClick={() => handleNavtoProfile(user?._id)}
          key={index}
          className="flex items-center justify-between bg-gray-900 border border-[#333] p-4 rounded-2xl hover:bg-gray-700 transition-all"
        >
          {/* Left: Profile image and name */}
          <div className="flex items-center gap-4">
            <img
              src={user?.image}
              alt={user?.user_name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#444]"
            />
            <div>
              <h3 className="text-white font-semibold text-base sm:text-lg">
                {user?.user_name}
              </h3>
              <p className="text-gray-400 text-sm">Active 2h ago</p>
            </div>
          </div>

          {/* Right: Message & More */}
          <div className="flex items-center gap-3">
            <button
              onClick={()=>handleFollow(user)}
              className="flex items-center gap-1 text-white bg-blue-500 px-3 py-1.5 rounded-md text-sm sm:text-xs"
            >
              {/* Only icon on mobile, full text on sm+ */}
              {user._id !== currentUser?.id && (
                <>
                  {user?.followers?.includes(currentUser?.id) ? (
                    <span className="hidden sm:inline">UnFollow</span>
                  ) : (
                    <div className="flex">
                      <UserPlus className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Follow</span>
                    </div>
                  )}
                </>
              )}
            </button>
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
