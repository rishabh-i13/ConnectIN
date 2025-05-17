import { useState } from "react";
import { useAuthUser } from "../lib/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import DefaultPFP from "../assets/defaultPFP.jpg";
import { Loader } from "lucide-react";
import { RiDeleteBin6Line } from "react-icons/ri";
import PostAction from "../PostAction";
import { SlLike } from "react-icons/sl";
import { TfiComments } from "react-icons/tfi";
import { FaShare } from "react-icons/fa6";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { IoSendSharp } from "react-icons/io5";
import { FiLoader } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import { useParams } from "react-router-dom";

const Post = ({ post }) => {
  const { data: authUser, isLoading } = useAuthUser();
  if (isLoading) return null;
  const { postId } = useParams();

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const isAuther = authUser._id === post.author._id;
  const [isLiked, setIsLiked] = useState(post.likes.includes(authUser._id));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  const queryClient = useQueryClient();

  const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/posts/delete/${post._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: createComment, isPending: isCreatingComment } = useMutation({
    mutationFn: async (newComment) => {
      await axiosInstance.post(`/posts/${post._id}/comment`, {
        content: newComment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Comment added successfully");
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Failed to add comment");
    },
  });

  const { mutate: deleteComment, isPending: isDeletingComment } = useMutation({
    mutationFn: async (commentId) => {
      await axiosInstance.delete(`/posts/${post._id}/comment/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Comment deleted successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete comment");
    },
  });

  const { mutate: likePost, isPending: isLikingPost } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(`/posts/${post._id}/like`);
      return response.data;
    },
    onSuccess: () => {
      setIsLiked(true); // set only on success
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: (error) => {
      toast.error(error.message || "Error in liking post");
    },
  });

  const { mutate: removeLikePost, isPending: isRemovingLike } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(
        `/posts/${post._id}/removeLike`
      );
      return response.data;
    },
    onSuccess: () => {
      setIsLiked(false); // set only on success
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message || "Error in removing like");
    },
  });

  const handleDeletePost = () => {
    deletePost();
  };

  const handleLikeToggle = () => {
    if (isLiked) {
      removeLikePost(); // will update isLiked to false on success
    } else {
      likePost(); // will update isLiked to true on success
    }
  };

  const handleDeleteComment = (commentId) => {
    setDeletingCommentId(commentId); // Set the deleting comment ID
    deleteComment(commentId, {
      onSuccess: () => {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== commentId)
        );
        setDeletingCommentId(null); // Reset after deletion
      },
    });
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      createComment(newComment);
      setNewComment("");
      setComments([
        ...comments,
        {
          content: newComment,
          user: {
            _id: authUser._id,
            name: authUser.name,
            profilePicture: authUser.profilePicture,
          },
          createdAt: new Date(),
        },
      ]);
    }
  };

  const handleShare = () => {
    const postLink = `${window.location.origin}/post/${post._id}`;
    navigator.clipboard
      .writeText(postLink)
      .then(() => {
        toast.success("Post link copied");
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  };

  return (
    <div className="bg-white rounded-lg shadow mb-4">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-black">
            <Link to={`/profile/${post?.author?.username}`}>
              <img
                src={post.author.profilePicture || DefaultPFP}
                alt={post.author.name}
                className="size-10 rounded-full mr-3"
              />
            </Link>

            <div>
              <Link to={`/profile/${post?.author?.username}`}>
                <h3 className="font-semibold text-black">{post.author.name}</h3>
              </Link>
              <p className="text-xs text-[#360072]">{post.author.headline}</p>
              <p className="text-xs text-[#8E00F4]">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          {isAuther && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-red-500 hover:text-red-700"
            >
              {isDeletingPost ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <RiDeleteBin6Line size={18} />
              )}
            </button>
          )}
        </div>
        <p className="mb-4 text-black whitespace-pre-wrap">{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post content"
            className="rounded-lg w-full mb-4"
          />
        )}

        <div className="flex justify-between text-[#360072]">
          <PostAction
            icon={
              isLiked ? (
                <FaHeart size={18} className="text-[#360072]" />
              ) : (
                <FaRegHeart size={18} className="text-[#360072]" />
              )
            }
            text={`Like (${post.likes.length})`}
            onClick={handleLikeToggle}
          />

          <PostAction
            icon={<TfiComments size={18} />}
            text={`Comments (${comments.length})`}
            onClick={() => setShowComments(!showComments)}
          />
          <PostAction
            icon={<FaShare size={18} />}
            text="Share"
            onClick={handleShare}
          />
        </div>
      </div>

      {showComments && (
        <div className="px-4 pb-4">
          <div className="mb-4 max-h-60 overflow-y-auto">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="mb-2 bg-gray-200 p-2 rounded flex items-start text-black"
              >
                <img
                  src={comment.user?.profilePicture || DefaultPFP}
                  alt={comment.user?.name}
                  className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
                />
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center flex-row">
                      <span className="font-medium mr-2">
                        {comment.user?.name}
                      </span>
                      <span className="text-xs text-[#8E00F4]">
                        {formatDistanceToNow(new Date(comment.createdAt))}
                      </span>
                    </div>
                    {(authUser._id === comment.user?._id ||
                      authUser._id === post.author._id) && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-red-500 text-sm"
                        disabled={deletingCommentId === comment._id} // Disable only for the deleting comment
                      >
                        {deletingCommentId === comment._id ? (
                          <FiLoader size={18} className="animate-spin" />
                        ) : (
                          <RiDeleteBin6Line size={18} />
                        )}
                      </button>
                    )}
                  </div>
                  <p className="text-black">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleAddComment}
            className="relative flex items-center w-full"
          >
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-2 pr-10 rounded-full bg-gray-300 focus:outline-none focus:ring-2 focus:ring-[#360072] text-black"
            />

            <div
              className="absolute right-2 cursor-pointer rounded-full p-1 flex items-center justify-center"
              onClick={handleAddComment}
            >
              <IoSendSharp
                size={26}
                className="bg-gradient-to-r from-[#360072] to-[#8E00F4] text-transparent bg-clip-text"
              />
              <IoSendSharp size={26} className="text-[#360072]" />
            </div>
          </form>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Are you sure you want to delete this post?
            </h2>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 text-gray-800 rounded-lg px-4 py-2 hover:bg-gray-400 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-gradient-to-r from-[#f43900] to-[#eb5550] text-white rounded-lg px-4 py-2 hover:bg-[#360072] transition-colors"
                onClick={() => {
                  handleDeletePost();
                  setIsModalOpen(false);
                }}
              >
                {isDeletingPost ? (
                  <Loader size={18} className="animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
