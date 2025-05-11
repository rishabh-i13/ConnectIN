import React from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { useAuthUser } from "../lib/hooks";
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation";
import Post from "../components/Post";
import { FaUserAlt } from "react-icons/fa";
import RecommendedUser from "../components/RecommendedUser";

const HomePage = () => {
  const { data: authUser, isLoading } = useAuthUser();

  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/suggestions");
      return res.data;
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts");
      return res.data;
    },
  });

  console.log("Rusers", recommendedUsers);
  console.log("ppposts", posts);
  return (
    <div className="h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Sidebar - Fixed */}
      <div className="hidden lg:block lg:col-span-1 h-full">
        <div className="h-full overflow-y-auto">
          <Sidebar user={authUser} />
        </div>
      </div>

      {/* Middle Content - Scrollable */}
      <div className="col-span-1 lg:col-span-2 order-first lg:order-none h-full overflow-y-auto pr-2">
        <PostCreation user={authUser} />
        {posts?.map((post) => (
          <Post key={post._id} post={post} />
        ))}

        {posts?.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="mb-6">
              <FaUserAlt size={64} className="mx-auto text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              No Posts Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Connect with others to start seeing posts in your feed!
            </p>
          </div>
        )}
      </div>

      {/* Right Suggestions - Fixed */}
      {!isLoading && recommendedUsers?.length > 0 && (
        <div className="col-span-1 lg:col-span-1 hidden lg:block h-full">
          <div className="h-full overflow-y-auto">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold mb-4 text-black">
                People you may know
              </h2>
              {recommendedUsers?.map((user) => (
                <RecommendedUser key={user._id} user={user} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
