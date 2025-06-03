import { ExportAssets } from "../assets/ExportAssets";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

function NavBar() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AppContext) || {};
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userName =
    user && (user as any)?.data?.name
      ? (user as any).data.name.charAt(0).toUpperCase()
      : null;

  const isVerified =
    user && (user as any)?.data?.isVerified
      ? (user as any).data.isVerified
      : false;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/auth/logout`, {}, {
        withCredentials: true, // Ensure cookies are sent with the request
      }
      );
      console.log("Logout response:", response);
      if (response) {
        if (setUser) setUser(response.data);

      }
      response.data.status === "success" && toast.success("Logged out successfully!");

      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <nav className="w-full flex items-center justify-between p-4 sm:p-6 bg-transparent absolute top-0 z-50">
      <img
        src={ExportAssets.logo}
        alt="logo"
        className="w-28 sm:w-32 cursor-pointer"
        onClick={() => navigate("/")}
      />
      {userName ? (
        <div className="relative" ref={dropdownRef}>
          <button
            className="rounded-full bg-blue-500 text-white flex items-center justify-center w-12 h-12 text-xl font-bold shadow cursor-pointer border-2 border-blue-700 hover:bg-blue-600 transition"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-label="user menu"
          >
            {userName}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
              <div className="px-4 py-2 text-gray-700 flex items-center gap-2">
                <span className="font-semibold">Status:</span>
                {isVerified ? (
                  <span className="text-green-600 font-medium">Verified</span>
                ) : (
                  <span className="text-yellow-500 font-medium">Not Verified</span>
                )}
              </div>
              {!isVerified && (
                <button
                  className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 transition"
                  onClick={() => navigate("/verify-email")}
                >
                  Verify Email
                </button>
              )}
              <button
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 sm:px-6 sm:py-3 flex items-center gap-2 border border-gray-600 hover:bg-gray-200 rounded-full font-semibold transition duration-300 cursor-pointer"
        >
          Log In <img src={ExportAssets.arrow_icon} alt="" />
        </button>
      )}
    </nav>
  );
}

export default NavBar;