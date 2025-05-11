import React from "react";
import { useMutation, useQuery,useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthUser } from "../lib/hooks";
import { Link } from "react-router-dom";
import DefaultPFP from "../assets/defaultPFP.jpg";
import Sidebar from "../components/Sidebar";
import { ImUserPlus } from "react-icons/im";
import { formatDistanceToNow } from "date-fns";
import { FiEye } from "react-icons/fi";
import { TiTrash } from "react-icons/ti";
import { MdMessage } from "react-icons/md";
import { FaExternalLinkAlt } from "react-icons/fa";
import { BiSolidLike } from "react-icons/bi";

function NotificationsPage() {
  const { data: authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axiosInstance.get("/notifications");
      return res.data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1, // every 10 seconds
    staleTime: 0,
  });
  
  const { mutate: markAsReadMutation } = useMutation({
    mutationFn: async (notificationId) => {
      await axiosInstance.put(`/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification marked as read!");
    },
  });

  const { mutate: deleteNotificationMutation } = useMutation({
    mutationFn: async (notificationId) => {
      await axiosInstance.delete(`/notifications/${notificationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification deleted!");
    },
  });
  

  const renderNotificationIcon = (type) => {
    switch (type) {
        case "like":
            return <BiSolidLike className='text-blue-500' />;

        case "comment":
            return <MdMessage className='text-green-500' />;
        case "connectionAccepted":
            return <ImUserPlus className='text-purple-500' />;
        default:
            return null;
    }
};

  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case "like":
        return (
          <span>
            <strong>{notification.relatedUser.name}</strong> liked your post
          </span>
        );
      case "comment":
        return (
          <span>
            <Link
              to={`/profile/${notification.relatedUser.username}`}
              className="font-bold"
            >
              {notification.relatedUser.name}
            </Link>{" "}
            commented on your post
          </span>
        );
      case "connectionAccepted":
        return (
          <span>
            <Link
              to={`/profile/${notification.relatedUser.username}`}
              className="font-bold"
            >
              {notification.relatedUser.name}
            </Link>{" "}
            accepted your connection request
          </span>
        );
      default:
        return null;
    }
  };

  const renderRelatedPost = (relatedPost) => {
    if (!relatedPost) return null;

    return (
      <Link
        to={`/post/${relatedPost._id}`}
        className="mt-2 p-2 bg-gray-50 rounded-md flex items-center space-x-2 hover:bg-gray-100 transition-colors"
      >
        {relatedPost.image && (
          <img
            src={relatedPost.image}
            alt="Post preview"
            className="w-10 h-10 object-cover rounded"
          />
        )}
        <div className="flex-1 overflow-hidden">
          <p className="text-sm text-gray-600 truncate">
            {relatedPost.content}
          </p>
        </div>
        <FaExternalLinkAlt size={14} className="text-gray-400" />
      </Link>
    );
  };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        <div className='col-span-1 lg:col-span-1 hidden lg:block'>
            <Sidebar user={authUser} />
        </div>
        <div className='col-span-1 lg:col-span-3'>
            <div className='bg-white rounded-lg shadow p-6'>
                <h1 className='text-2xl font-bold mb-6 text-black'>Notifications</h1>

                {isLoading ? (
                    <p className="text-gray-600">Loading notifications...</p>
                ) : notifications && notifications.length > 0 ? (
                    <ul>
                        {notifications.map((notification) => (
                            <li
                                key={notification._id}
                                className={`bg-white border rounded-lg p-4 my-4 transition-all hover:shadow-md ${
                                    !notification.read ? "border-[#8E00F4]" : "border-gray-200"
                                }`}
                            >
                                <div className='flex items-start justify-between'>
                                    <div className='flex items-center space-x-4'>
                                        <Link to={`/profile/${notification.relatedUser.username}`}>
                                            <img
                                                src={notification.relatedUser.profilePicture || DefaultPFP}
                                                alt={notification.relatedUser.name}
                                                className='w-12 h-12 rounded-full object-cover'
                                            />
                                        </Link>

                                        <div>
                                            <div className='flex items-center gap-2'>
                                                <div className='p-1 bg-gray-100 rounded-full'>
                                                    {renderNotificationIcon(notification.type)}
                                                </div>
                                                <p className='text-sm text-black'>{renderNotificationContent(notification)}</p>
                                            </div>
                                            <p className='text-xs text-gray-500 mt-1'>
                                                {formatDistanceToNow(new Date(notification.createdAt), {
                                                    addSuffix: true,
                                                })}
                                            </p>
                                            {renderRelatedPost(notification.relatedPost)}
                                        </div>
                                    </div>

                                    <div className='flex gap-2'>
                                        {!notification.read && (
                                            <button
                                                onClick={() => markAsReadMutation(notification._id)}
                                                className='p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors'
                                                aria-label='Mark as read'
                                            >
                                                <FiEye size={16} />
                                            </button>
                                        )}

                                        <button
                                            onClick={() => deleteNotificationMutation(notification._id)}
                                            className='p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors'
                                            aria-label='Delete notification'
                                        >
                                            <TiTrash size={16} />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">No new notification at the moment!</p>
                )}
            </div>
        </div>
    </div>
);
}

export default NotificationsPage;
