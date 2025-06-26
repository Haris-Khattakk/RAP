import React, { useState } from "react";
import { User, Heart, ThumbsDown, CornerUpRight } from "lucide-react";
import { CommentCard, Inputbox } from "../components/ui/index";

const CommentSection = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      name: "Mike Wilson",
      time: "Just now",
      text: "Great location! I stayed here last month and loved it.",
      likes: 3,
      dislikes: 0,
      avatar: "",
      image: "",
      replies: [],
    },
  ]);

  const [visibleCount, setVisibleCount] = useState(5);
  const [replyingTo, setReplyingTo] = useState(null);

  const handleShowMore = () => {
    setVisibleCount(comments.length);
  };

  const handlePostComment = (text, images = "") => {
    if (!text.trim() && !image) return;

    const newComment = {
      id: Date.now(),
      name: "Current User",
      time: "Just now",
      text: text,
      likes: 0,
      dislikes: 0,
      avatar: "",
      images: images,
      replies: [],
    };

    if (replyingTo) {
      const addReplyToComment = (comments, targetId, newReply) => {
        return comments.map((comment) => {
          if (comment.id === targetId) {
            return {
              ...comment,
              replies: [...comment.replies, newReply],
            };
          }

          if (comment.replies.length > 0) {
            return {
              ...comment,
              replies: addReplyToComment(comment.replies, targetId, newReply),
            };
          }

          return comment;
        });
      };

      setComments(
        addReplyToComment(comments, replyingTo.commentId, newComment)
      );
      setReplyingTo(null);
    } else {
      setComments([newComment, ...comments]);
    }
  };

  const handleReplyClick = (commentId) => {
    setReplyingTo(replyingTo?.commentId === commentId ? null : { commentId });
  };

  const CommentTree = ({ comment, depth = 0 }) => {
    const isReplying = replyingTo?.commentId === comment.id;

    return (
      <div
        className={`space-y-2 ${
          depth > 0 ? "border-l-2 border-gray-700 pl-4" : ""
        }`}
      >
        <CommentCard
          comment={comment}
          onReply={() => handleReplyClick(comment.id)}
          depth={depth}
        />

        {isReplying && (
          <div className={`mt-2 ${depth > 0 ? "ml-4" : "ml-14"}`}>
            <Inputbox
              onPost={handlePostComment}
              autoFocus
              onCancel={() => setReplyingTo(null)}
            />
          </div>
        )}

        {comment.replies.length > 0 && (
          <div className="space-y-4 mt-4">
            {comment.replies.map((reply) => (
              <CommentTree key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 text-white max-w-3xl mx-auto h-[70vh] flex flex-col">
      {!replyingTo && <Inputbox onPost={handlePostComment} />}

      <div className="flex-1 overflow-y-auto mt-4 space-y-6 pr-2">
        {comments.slice(0, visibleCount).map((comment) => (
          <CommentTree key={comment.id} comment={comment} />
        ))}
      </div>

      {visibleCount < comments.length && (
        <div className="pt-4 text-center">
          <button
            onClick={handleShowMore}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            See more comments
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
