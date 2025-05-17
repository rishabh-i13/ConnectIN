import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import DefaultPFP from "../../assets/defaultPFP.jpg";

const ProfilePosts = ({ userId, isOwnProfile }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["posts", userId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/posts/user/id/${userId}`);
      return response.data;
    },
  });

 const handlePrev = () => {
  setCurrentIndex((prev) => Math.max(prev - (window.innerWidth >= 768 ? 3 : 1), 0));
};

const handleNext = () => {
  setCurrentIndex((prev) =>
    Math.min(prev + (window.innerWidth >= 768 ? 3 : 1), posts.length - (window.innerWidth >= 768 ? 3 : 1))
  );
};

  const openPost = (postId) => {
    navigate(`/post/${postId}`);
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <p className="text-[#360072]">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    toast.error("Failed to load posts");
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <p className="text-[#360072]">Error loading posts</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-black">Posts</h2>
        <p className="text-[#360072]">
          {isOwnProfile ? "You haven't" : "This user hasn't"} posted yet.
        </p>
      </div>
    );
  }

  return (
  <div className="bg-white shadow rounded-lg p-6 mb-6">
    <h2 className="text-xl font-semibold mb-4 text-black">Posts</h2>
    <div className="relative">
      <div className="flex overflow-hidden">
        {posts
          .slice(
            currentIndex,
            currentIndex + (window.innerWidth >= 768 ? 3 : 1)
          )
          .map((post) => (
            <div
              key={post._id}
              className="w-full sm:w-full md:w-1/3 p-2 cursor-pointer"
              onClick={() => openPost(post._id)}
            >
              <div className="border border-[#360072] rounded-lg p-4 h-64 overflow-hidden hover:bg-gray-50 transition duration-300">
                <div className="flex items-center mb-2">
                  <img
                    src={post.author.profilePicture || DefaultPFP}
                    alt={post.author.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div>
                    <p className="text-sm font-semibold text-black">
                      {post.author.name}
                    </p>
                    <p className="text-xs text-[#360072]">
                      @{post.author.username}
                    </p>
                  </div>
                </div>
                <p className="text-[#360072] text-sm line-clamp-6">
                  {post.content}
                </p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="mt-2 w-full h-24 object-cover rounded"
                  />
                )}
              </div>
            </div>
          ))}
      </div>
      {posts.length > (window.innerWidth >= 768 ? 3 : 1) && (
        <>
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#360072] text-white p-2 rounded-full ${
              currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#8E00F4]"
            } transition duration-300`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= posts.length - (window.innerWidth >= 768 ? 3 : 1)}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#360072] text-white p-2 rounded-full ${
              currentIndex >= posts.length - (window.innerWidth >= 768 ? 3 : 1)
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#8E00F4]"
            } transition duration-300`}
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
    </div>
  </div>
);
};

export default ProfilePosts;