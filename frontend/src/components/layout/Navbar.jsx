import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import { useAuthUser } from "../../lib/hooks";
import Logo from "../../assets/logoconnectin2.png";
import { IoHome, IoNotifications } from "react-icons/io5";
import { FaUserAlt } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";

const Navbar = () => {
  const { data: authUser, isLoading } = useAuthUser();
  const queryClient = useQueryClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const location = useLocation();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    refetch();
  }, [location]);

  const { data: notifications,refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => await axiosInstance.get("/notifications"),
    enabled: !!authUser,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 10000, // 10 seconds: adjust based on your app
  });

  const { data: connectionRequests } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: async () => axiosInstance.get("/connections/requests"),
    enabled: !!authUser,
  });

  const { mutate: logout } = useMutation({
    mutationFn: () => axiosInstance.post("/auth/logout"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  const unReadNotificationsCount = (notifications?.data ?? []).filter(
    (notif) => !notif.read
  ).length;

  const unreadConnectionRequestsCount = connectionRequests?.data?.length;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogoutClick = () => {
    setIsModalOpen(true); // Open modal instead of logging out directly
  };

  const confirmLogout = () => {
    logout();
    setIsModalOpen(false);
    if (isMenuOpen) toggleMenu(); // Close mobile menu if open
  };

  const cancelLogout = () => {
    setIsModalOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Left side: Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/">
              <img className="h-10 rounded" src={Logo} alt="LinkedIn" />
            </Link>
          </div>

          {/* Right side: Hamburger for mobile, links for desktop */}
          <div className="flex items-center">
            {/* Hamburger Icon (visible on mobile) */}
            <button
              className="md:hidden text-neutral focus:outline-none"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <IoClose size={24} />
              ) : (
                <GiHamburgerMenu size={24} />
              )}
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              {authUser ? (
                <>
                  <Link
                    to="/"
                    className="text-neutral flex flex-col items-center"
                  >
                    <IoHome size={20} />
                    <span className="text-xs">Home</span>
                  </Link>
                  <Link
                    to="/network"
                    className="text-neutral flex flex-col items-center relative"
                  >
                    <BsFillPeopleFill size={22} />
                    <span className="text-xs">My Network</span>
                    {unreadConnectionRequestsCount > 0 && (
                      <span
                        className="absolute -top-1 right-4 bg-[#8E00F4] text-white text-xs 
                        rounded-full size-4 flex items-center justify-center"
                      >
                        {unreadConnectionRequestsCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/notifications"
                    className="text-neutral flex flex-col items-center relative"
                  >
                    <IoNotifications size={22} />
                    <span className="text-xs">Notifications</span>
                    {unReadNotificationsCount > 0 && (
                      <span
                        className="absolute -top-1 right-4 bg-[#8E00F4] text-white text-xs 
                        rounded-full size-4 flex items-center justify-center"
                      >
                        {unReadNotificationsCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to={`/profile/${authUser.username}`}
                    className="text-neutral flex flex-col items-center"
                  >
                    <FaUserAlt size={20} />
                    <span className="text-xs">Me</span>
                  </Link>
                  <button
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                    onClick={handleLogoutClick} // Trigger modal
                  >
                    <HiOutlineLogout size={20} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn bg-[#8E00F4] text-white border-none"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="btn bg-[#360072] text-white border-none"
                  >
                    Join now
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu (visible when hamburger is clicked) */}
        {isMenuOpen && (
          <div
            className="md:hidden bg-white absolute top-full right-0 w-1/2 z-20 [box-shadow:0_4px_6px_-1px_rgba(142,0,244,0.3),0_2px_4px_-2px_rgba(142,0,244,0.2)]"
            style={{ minWidth: "150px" }}
          >
            <div className="flex flex-col items-start px-4 py-2 space-y-2">
              {authUser ? (
                <>
                  <Link
                    to="/"
                    className="text-neutral flex items-center space-x-2 w-full"
                    onClick={toggleMenu}
                  >
                    <IoHome size={20} />
                    <span>Home</span>
                  </Link>
                  <Link
                    to="/network"
                    className="text-neutral flex items-center space-x-2 relative w-full"
                    onClick={toggleMenu}
                  >
                    <BsFillPeopleFill size={22} />
                    <span>My Network</span>
                    {unreadConnectionRequestsCount > 0 && (
                      <span
                        className="absolute left-6 top-0 bg-[#8E00F4] text-white text-xs 
                        rounded-full size-4 flex items-center justify-center"
                      >
                        {unreadConnectionRequestsCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/notifications"
                    className="text-neutral flex items-center space-x-2 relative w-full"
                    onClick={toggleMenu}
                  >
                    <IoNotifications size={22} />
                    <span>Notifications</span>
                    {unReadNotificationsCount > 0 && (
                      <span
                        className="absolute left-6 top-0 bg-[#8E00F4] text-white text-xs 
                        rounded-full size-4 flex items-center justify-center"
                      >
                        {unReadNotificationsCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to={`/profile/${authUser.username}`}
                    className="text-neutral flex items-center space-x-2 w-full"
                    onClick={toggleMenu}
                  >
                    <FaUserAlt size={20} />
                    <span>Me</span>
                  </Link>
                  <button
                    className="text-neutral flex items-center space-x-2 text-gray-600 hover:text-gray-800 w-full"
                    onClick={handleLogoutClick} // Trigger modal
                  >
                    <HiOutlineLogout size={20} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn bg-[#8E00F4] text-white border-none w-full text-left"
                    onClick={toggleMenu}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="btn bg-[#360072] text-white border-none w-full text-left"
                    onClick={toggleMenu}
                  >
                    Join now
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Are you sure you want to log out?
            </h2>
            <div className="flex justify-end gap-4">
              <button
                className="btn bg-gray-300 text-gray-800 rounded-lg px-4 py-2 hover:bg-gray-400 transition-colors border-none"
                onClick={cancelLogout}
              >
                Cancel
              </button>
              <button
                className="btn bg-gradient-to-r from-[#360072] to-[#8E00F4] text-white rounded-lg px-4 py-2 hover:bg-[#360072] transition-colors border-none"
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
