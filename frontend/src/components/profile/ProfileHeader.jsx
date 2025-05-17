import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-hot-toast";
import { useAuthUser } from "../../lib/hooks";
import DefaultPFP from "../../assets/defaultPFP.jpg";
import DefaultBanner from "../../assets/defaultBanner.jpg";
import { Camera, Clock, UserCheck, UserPlus, X ,MapPin} from "lucide-react";

const ProfileHeader = ({ userData, onSave, isOwnProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const queryClient = useQueryClient();

  const { data: authUser } = useAuthUser();

  // Fetch connection status
  const { data: connectionStatus, isLoading: isConnectionLoading, refetch: refetchConnectionStatus } = useQuery({
    queryKey: ["connectionStatus", userData._id],
    queryFn: () => axiosInstance.get(`/connections/status/${userData._id}`),
    enabled: !isOwnProfile, // Only fetch if not own profile
  });

  const { mutate: sendConnectionRequest } = useMutation({
    mutationFn: (userId) => axiosInstance.post(`/connections/request/${userId}`),
    onSuccess: () => {
      toast.success("Connection request sent");
      refetchConnectionStatus();
      queryClient.invalidateQueries(["connectionRequests"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });

  const { mutate: acceptRequest } = useMutation({
    mutationFn: (requestId) =>
      axiosInstance.put(`/connections/accept/${requestId}`),
    onSuccess: () => {
      toast.success("Connection request accepted");
      refetchConnectionStatus();
      queryClient.invalidateQueries(["connectionRequests"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });

  const { mutate: rejectRequest } = useMutation({
    mutationFn: (requestId) =>
      axiosInstance.put(`/connections/reject/${requestId}`),
    onSuccess: () => {
      toast.success("Connection request rejected");
      refetchConnectionStatus();
      queryClient.invalidateQueries(["connectionRequests"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });

  const { mutate: removeConnection } = useMutation({
    mutationFn: (userId) => axiosInstance.delete(`/connections/${userId}`),
    onSuccess: () => {
      toast.success("Connection removed");
      refetchConnectionStatus();
      queryClient.invalidateQueries(["connectionRequests"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });

  const renderConnectionButton = () => {
    if (isConnectionLoading) {
      return (
        <button
          className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-500"
          disabled
        >
          Loading...
        </button>
      );
    }

    const baseClass =
      "flex items-center justify-center text-white py-2 px-4 rounded-full transition duration-300 shadow-md hover:shadow-lg";

    switch (connectionStatus?.data?.status) {
      case "requestSent": // Request sent by the authenticated user
        return (
          <button
            className={`${baseClass} bg-yellow-500 text-white flex items-center`}
            disabled
          >
            <Clock size={18} className="mr-2" />
            Pending
          </button>
        );

      case "requestReceived": // Request received from the profile user
        return (
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => acceptRequest(connectionStatus.data.requestId)}
              className={`${baseClass} bg-gradient-to-r from-[#4B0082] to-[#6A00B8]`}
            >
              Accept
            </button>
            <button
              onClick={() => rejectRequest(connectionStatus.data.requestId)}
              className={`${baseClass} bg-gradient-to-r from-[#8E00F4] to-[#B600F4]`}
            >
              Reject
            </button>
          </div>
        );

      case "connected": // Already connected
        return (
          <div className="flex gap-3 justify-center">
            <div
              className={`${baseClass} bg-gradient-to-r from-[#4B0082] to-[#6A00B8]`}
            >
              <UserCheck size={18} className="mr-2" />
              Connected
            </div>
            <button
              className={`${baseClass} bg-gradient-to-r from-[#8E00F4] to-[#B600F4] text-sm`}
              onClick={() => removeConnection(userData._id)}
            >
              <X size={18} className="mr-2" />
              Remove
            </button>
          </div>
        );

      default: // "notConnected"
        return (
          <button
            onClick={() => sendConnectionRequest(userData._id)}
            className={`${baseClass} bg-gradient-to-r from-[#4B0082] to-[#6A00B8]`}
          >
            <UserPlus size={18} className="mr-2" />
            Connect
          </button>
        );
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData((prev) => ({ ...prev, [event.target.name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(editedData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white shadow-lg rounded-xl mb-6 overflow-hidden">
      <div
        className="relative h-48 bg-cover bg-center"
        style={{
          backgroundImage: `url('${
            editedData.bannerImg || userData.bannerImg || DefaultBanner
          }')`,
        }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        {isEditing && (
          <label className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-lg cursor-pointer hover:bg-white transition">
            <Camera size={18} className="text-gray-800" />
            <input
              type="file"
              className="hidden"
              name="bannerImg"
              onChange={handleImageChange}
              accept="image/*"
            />
          </label>
        )}
      </div>

      <div className="p-6">
        <div className="relative -mt-20 mb-4 flex justify-center">
          <img
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
            src={
              editedData.profilePicture || userData.profilePicture || DefaultPFP
            }
            alt={userData.name}
          />
          {isEditing && (
            <label className="absolute bottom-1 right-1/2 transform translate-x-16 bg-white/90 p-2 rounded-full shadow-lg cursor-pointer hover:bg-white transition">
              <Camera size={18} className="text-gray-800" />
              <input
                type="file"
                className="hidden"
                name="profilePicture"
                onChange={handleImageChange}
                accept="image/*"
              />
            </label>
          )}
        </div>

        <div className="text-center mb-6">
          {isEditing ? (
            <input
              type="text"
              value={editedData.name ?? userData.name}
              onChange={(e) =>
                setEditedData({ ...editedData, name: e.target.value })
              }
              className="text-2xl font-semibold text-gray-800 text-center w-full bg-gray-50 border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#6A00B8]"
            />
          ) : (
            <h1 className="text-2xl font-semibold text-gray-800">
              {userData.name}
            </h1>
          )}

          {isEditing ? (
            <input
              type="text"
              value={editedData.headline ?? userData.headline}
              onChange={(e) =>
                setEditedData({ ...editedData, headline: e.target.value })
              }
              className="text-gray-600 text-center w-full bg-gray-50 border border-gray-200 rounded-lg p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-[#6A00B8]"
            />
          ) : (
            <p className="text-gray-600 mt-1">{userData.headline}</p>
          )}

          <div className="flex justify-center items-center mt-3 gap-2">
            <MapPin size={16} className="text-[#6A00B8]" />
            {isEditing ? (
              <input
                type="text"
                value={editedData.location ?? userData.location}
                onChange={(e) =>
                  setEditedData({ ...editedData, location: e.target.value })
                }
                className="text-gray-600 text-center bg-gray-50 border border-gray-200 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-[#6A00B8]"
              />
            ) : (
              <span className="text-gray-600">{userData.location}</span>
            )}
          </div>
        </div>

        {isOwnProfile ? (
          isEditing ? (
            <button
              className="w-full bg-gradient-to-r from-[#4B0082] to-[#6A00B8] text-white py-2.5 px-4 rounded-full shadow-md hover:shadow-lg transition duration-300"
              onClick={handleSave}
            >
              Save Profile
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-gradient-to-r from-[#4B0082] to-[#6A00B8] text-white py-2.5 px-4 rounded-full shadow-md hover:shadow-lg transition duration-300"
            >
              Edit Profile
            </button>
          )
        ) : (
          <div className="flex justify-center">{renderConnectionButton()}</div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;