import React, { useState } from "react";
import {
  User,
  Heart,
  ThumbsDown,
  MessageSquare,
  Share2,
  MapPin,
  BarChart,
  UserPlus,
  MoreVertical,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { APIS } from "../../config/Config";
import { getTimeAgo } from "../functions/GetTimeAgo";
import { useFollowMutation } from "../react-query/follow&unfollowMutation";
import { MenuOption } from "./ui/index";
import { Delete, CreatePostForm, Share } from "./models/index";
import { CommentSection } from "../pages/index";

const PostCard = ({ post, currentUser, setPosts, posts }) => {
  const [agrees, setAgrees] = useState(post?.likes || []);
  const [disAgrees, setDisAgrees] = useState(post?.disLikes || []);
  const [followers, setFollowers] = useState(post?.owner?.followers || []);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showCommentSection, setShowCommentSection] = useState(false);
  // const queryClient = new QueryClient();

  const shareUrl = `https://rateaproperty.com/post/${post?._id}`;

  // mutation for agree
  const { mutate: likeMutate } = useMutation({
    mutationFn: async () => {
      // eslint-disable-next-line no-useless-catch
      try {
        if (agrees?.some((agree) => agree?.owner === currentUser?.id)) {
          await APIS.unLike(post._id);

          setAgrees((prevAgrees) =>
            prevAgrees.filter((agree) => agree?.owner !== currentUser?.id)
          );
        } else {
          await APIS.like(post._id);
          setAgrees((prevAgrees) => [
            ...prevAgrees,
            { owner: currentUser?.id, for_post: post._id },
          ]);

          setDisAgrees((prevDisagrees) => {
            if (
              prevDisagrees.some(
                (disagree) => disagree.owner === currentUser?.id
              )
            ) {
              APIS.unDisLike(post._id);
              return prevDisagrees.filter(
                (disagree) => disagree.owner !== currentUser?.id
              );
            }
            return prevDisagrees;
          });
        }
      } catch (error) {
        throw error;
      }
      // throw new Error("Da")
    },
    onError: () => {
      if (agrees.some((agree) => agree?.owner === currentUser?.id)) {
        setAgrees((prevagrees) => [
          ...prevagrees,
          { owner: currentUser?.id, for_post: post._id },
        ]);
      } else {
        setAgrees((prevagrees) =>
          prevagrees.filter((agree) => agree.owner !== currentUser?.id)
        );

        if (disAgrees.some((dagree) => dagree?.owner === currentUser?.id)) {
          setDisAgrees((prevdAgrees) => [
            ...prevdAgrees,
            { owner: currentUser?.id, for_post: post._id },
          ]);
        }
      }
    },
  });
  // mutation for disagree
  const { mutate: disLikeMutate } = useMutation({
    mutationFn: async () => {
      // eslint-disable-next-line no-useless-catch
      try {
        if (disAgrees.some((disagree) => disagree?.owner === currentUser?.id)) {
          await APIS.unDisLike(post._id);
          setDisAgrees((prevDisagrees) =>
            prevDisagrees.filter(
              (disagree) => disagree.owner !== currentUser?.id
            )
          );
        } else {
          await APIS.disLike(post._id);
          setDisAgrees((prevDisagrees) => [
            ...prevDisagrees,
            { owner: currentUser?.id, for_post: post._id },
          ]);

          setAgrees((prevAgrees) => {
            if (prevAgrees.some((agree) => agree.owner === currentUser?.id)) {
              APIS.unLike(post._id);
              return prevAgrees.filter(
                (agree) => agree.owner !== currentUser?.id
              );
            }
            return prevAgrees;
          });
        }
      } catch (error) {
        throw error;
      }
      // throw new Error("Dasdas");
    },
    onError: () => {
      // console.log(error);
      if (disAgrees.some((disagree) => disagree?.owner === currentUser?.id)) {
        setDisAgrees((prevDisagrees) => [
          ...prevDisagrees,
          { owner: currentUser?.id, for_post: post._id },
        ]);
      } else {
        setDisAgrees((prevDisagrees) =>
          prevDisagrees.filter((disagree) => disagree.owner !== currentUser?.id)
        );

        if (agrees.some((agree) => agree?.owner === currentUser?.id)) {
          setAgrees((prevAgrees) => [
            ...prevAgrees,
            { owner: currentUser?.id, for_post: post._id },
          ]);
        }
      }
    },
  });

  // mutation for follow/unfollow
  const { mutate: followMutate } = useFollowMutation({ followers });
  const handleFollow = () => {
    followMutate({
      follower: currentUser?.id,
      follow: post?.owner?._id,
    });
  };

  const navigate = useNavigate();

  const handleNavtoProfile = (profileId) => {
    navigate("/feed/profile", {
      state: { profileId, currentUser },
    });
  };

  const { mutate: deletePostMutate } = useMutation({
    mutationFn: async (postId) => {
      // eslint-disable-next-line no-useless-catch
      try {
        await APIS.delPost(postId);
        return postId;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (deletedPostId) => {
      console.log("Post deleted successfully:", deletedPostId);
      setPosts(posts?.filter((pst) => pst._id !== post._id));
      setIsDeleteModalOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
    },
  });

  return (
    <>
      {post ? (
        <div className="max-w-3xl w-full mx-auto mt-2 bg-gray-800 border border-gray-700 text-white rounded-2xl overflow-hidden shadow-lg">
          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between bg-gray-900 border-b border-gray-700">
            <div className="flex items-center gap-4">
              <div
                onClick={() => handleNavtoProfile(post?.owner?._id)}
                className="w-12 h-12 rounded-full bg-gradient-to-r bg-blue-600 to-purple-600 flex items-center justify-center overflow-hidden ring-2 ring-white/10"
              >
                {post?.owner?.image ? (
                  <img
                    src={post?.owner?.image}
                    alt="user name"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-white" />
                )}
              </div>

              <div className="flex items-center gap-2">
                <div>
                  <h4 className="text-white font-semibold text-base">
                    {post?.owner?.user_name}
                  </h4>
                  <p className="text-gray-400 text-xs">
                    {getTimeAgo(post?.createdAt)}
                  </p>
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
              <button
                onClick={handleFollow}
                className="flex items-center gap-1 text-white bg-blue-500 px-3 py-1.5 rounded-md text-sm sm:text-xs"
              >
                {/* Only icon on mobile, full text on sm+ */}
                {post?.owner?._id !== currentUser?.id && (
                  <>
                    {followers?.includes(currentUser?.id) ? (
                      <div className="flex items-center">
                        <User className="h-4 w-4 block md:hidden mr-1 text-white" />
                        <span className="hidden sm:inline">Unfollow</span>
                      </div>
                    ) : (
                      <div className="flex">
                        <UserPlus className="h-4 block md:hidden  w-4 mr-1" />
                        <span className="hidden sm:inline">Follow</span>
                      </div>
                    )}
                  </>
                )}
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 rounded-full hover:bg-gray-700 transition"
                >
                  <MoreVertical className="h-5 w-5 text-white" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 z-50">
                    <MenuOption
                      currentUser={currentUser}
                      postId={post?.owner?._id}
                      onEdit={() => {
                        setPostToEdit(post);
                        setIsEditModalOpen(true);
                        console.log("Edit clicked");
                        setShowMenu(false);
                      }}
                      onReport={() => {
                        console.log("Report clicked");
                        setShowMenu(false);
                      }}
                      onDelete={() => {
                        setIsDeleteModalOpen(true);
                        console.log("Delete clicked");
                        setShowMenu(false);
                      }}
                      editText="Post"
                      reportText="Post"
                      deleteText="Post"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 bg-gray-800">
            {/* <h3 className="text-xl font-bold mb-2">{post?.title}</h3> */}
            <div className="flex items-center w-full bg-gray-700 p-2 rounded-md justify-center text-gray-400 text-sm mb-2">
              <MapPin className="h-4 w-4 text-blue-400 mr-1" />
              <span>{post?.location}</span>
            </div>
            <p className="text-gray-300 text-base leading-relaxed mb-4">
              {post?.description}
            </p>

            {/* Image */}
            {post.media?.length > 0 &&
              post.media?.map((med, index) => (
                <div key={index} className="overflow-hidden rounded-lg">
                  {med?.type.startsWith("image") ? (
                    <img
                      src={med?.url}
                      alt="Post"
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <video controls className="w-full h-64 object-cover">
                      <source src={med?.url} type="video/mp4" />
                    </video>
                  )}
                </div>
              ))}
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-gray-700 bg-gray-900 text-sm">
            <div className="flex justify-between items-center text-gray-300">
              <div className="flex items-center gap-1">
                <Heart
                  className={`h-4 w-4 ${
                    agrees.some((agree) => agree?.owner === currentUser?.id)
                      ? "text-red-500"
                      : "text-white"
                  }`}
                  onClick={likeMutate}
                />
                {agrees.length}
              </div>
              <div className="flex items-center gap-1">
                <ThumbsDown
                  className={`h-4 w-4 ${
                    disAgrees.some(
                      (dagree) => dagree?.owner === currentUser?.id
                    )
                      ? "text-orange-500"
                      : "text-white"
                  }`}
                  onClick={disLikeMutate}
                />
                {disAgrees.length}
              </div>
              <div
                className="flex items-center gap-1 text-blue-400 cursor-pointer"
                onClick={() => setShowCommentSection((prev) => !prev)}
              >
                <MessageSquare className="h-4 w-4" />
                {post.comments?.length || 0}
              </div>

              <div
                className="flex items-center gap-1 text-green-400 cursor-pointer"
                onClick={() => setIsShareModalOpen(true)}
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </div>
            </div>
          </div>
          {showCommentSection && (
            <div className="px-6 py-4 border-t border-gray-700 bg-gray-900">
              <CommentSection postId={post._id} />
            </div>
          )}
        </div>
      ) : (
        <>Error Fetching post</>
      )}

      {/* this modal for update */}
      {isEditModalOpen && (
        <CreatePostForm
          currentUser={currentUser}
          profile={currentUser}
          onClose={() => setIsEditModalOpen(false)}
          postToEdit={postToEdit}
          isEditMode={true}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <Delete
          text="Are you sure you want to delete this post?"
          confirmText="Delete Post"
          cancelText="Cancel"
          onConfirm={() => deletePostMutate(post._id)}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
      {/* this model for sharing post  */}
      {isShareModalOpen && (
        <Share shareUrl={shareUrl} onClose={() => setIsShareModalOpen(false)} />
      )}
    </>
  );
};

export default PostCard;
