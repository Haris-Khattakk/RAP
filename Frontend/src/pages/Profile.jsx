import React, { useEffect, useState } from "react";
import { Grid3X3, Users, UserCheck, UserPlus } from "lucide-react";
import { PostCard, Followers } from "../components/index";
import { useLocation } from "react-router-dom";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useFollowMutation } from "../react-query/follow&unfollowMutation";
import { APIS } from "../../config/Config";

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
  const [activeTab, setActiveTab] = useState("posts");
  const [profile, setProfile] = useState(null);
  // const [userPosts, ]
  const LIMIT = 10;

  const location = useLocation();
  const currentUser = location.state?.currentUser;
  const profileId = location.state?.profileId;
  const queryClient = useQueryClient();

  const { data: fetchedProfile, isLoading } = useQuery({
    queryKey: ["userProfile", profileId],
    queryFn: async () => {
      return await APIS.getUser(profileId);
    },
    enabled: !!profileId,
  });

  useEffect(() => {
    if (!isLoading) {
      profileId
        ? setProfile(fetchedProfile.data)
        : setProfile(
            queryClient.getQueryData(["currentProfile", currentUser?.id]).data
          );
    }
  }, [profileId, currentUser, isLoading, fetchedProfile, queryClient]);

  // get user posts
  const {
    data: userPosts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["userPosts", profileId ? profileId : profile?._id],
    queryFn: async ({ pageParam = 1 }) => {
      return await APIS.getUserPosts({
        page: pageParam,
        limit: LIMIT,
        userId: profileId ? profileId : profile?._id,
      });
    },
    getNextPageParam: (lastPage) =>
      lastPage?.hasMore ? lastPage?.nextPage : undefined,
    enabled: !!(profileId ? profileId : profile?._id),
  });

  // mutation for follow/unfollow
  const { mutate: followMutate } = useFollowMutation({
    followers: profile?.followers,
  });
  const handleFollow = () => {
    followMutate({
      follower: currentUser?.id,
      follow: profile?._id,
    });
  };

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (
        scrollTop + clientHeight >= scrollHeight - 100 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="w-full bg-gray-600 py-4 min-h-screen">
      <div className="max-w-3xl mx-auto rounded-md px-4 py-6 bg-gray-800 text-[#f1f1f1]">
        {/* Top Info */}
        <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between gap-6">
          <img
            src={profile?.image}
            className="w-28 h-28 rounded-full object-cover border-4 border-gray-700 shadow-md"
            alt="Profile"
          />
          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-2xl font-bold">{profile?.user_name}</h1>
            {/* <p className="text-sm text-[#aaa]">
              Web Developer | Love to build UIs | React & Tailwind
            </p> */}
            {profile?._id !== currentUser?.id && (
              <div className="flex gap-3 justify-center md:justify-start mt-3">
                <button
                  onClick={handleFollow}
                  className="flex items-center gap-1 text-white bg-blue-500 px-3 py-1.5 rounded-md text-sm sm:text-xs"
                >
                  {/* Only icon on mobile, full text on sm+ */}
                  {/* {console.log(profile?.followers)}
                  {console.log(currentUser)} */}
                  <>
                    {profile?.followers?.some((f) =>
                      typeof f === "string"
                        ? f === currentUser?.id
                        : f?._id === currentUser?.id
                    ) ? (
                      <span className="hidden sm:inline">UnFollow</span>
                    ) : (
                      <div className="flex">
                        <UserPlus className="h-4 w-4 sm:mr-1" />
                        <span className="hidden sm:inline">Follow</span>
                      </div>
                    )}
                  </>
                </button>
                <button className="border border-gray-500 px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-700 transition">
                  Message
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Counter Section */}
        <div className="flex justify-around text-center mt-8 mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {profile?.posts?.length}
            </h2>
            <p className="text-sm text-gray-400">Posts</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              {profile?.followers?.length}
            </h2>
            <p className="text-sm text-gray-400">Followers</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              {profile?.following?.length}
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
          {activeTab === "posts" &&
            userPosts?.pages.map((page) =>
              page.data.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUser={currentUser}
                />
              ))
            )}
          {activeTab === "followers" && (
            <Followers users={profile?.followers} currentUser={currentUser} />
          )}
          {activeTab === "following" && (
            <Followers users={profile?.following} currentUser={currentUser} />
          )}
        </div>
      </div>
    </div>
  );
}
