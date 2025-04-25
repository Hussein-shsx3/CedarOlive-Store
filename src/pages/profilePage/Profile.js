import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
import {
  Camera,
  Package,
  Heart,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import Header from "../../components/header/header";

const cookies = new Cookies();

const Profile = () => {
  // Replace useGetCurrentUser with useSelector to get user from Redux store
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = cookies.get("token");
    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);

  // Redirect if user data is not found
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    cookies.remove("token");
    navigate("/signin");
  };

  // Show loading state if user data is not yet available
  if (!user) {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
          style={{ color: "var(--color-secondary)" }}
        ></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center">
      <Header />
      <div
        className="min-h-screen py-8 px-4 md:px-8"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <div className="max-w-6xl mx-auto">
          {/* User Info Header */}
          <div
            className="rounded-lg p-6 md:p-8 mb-6 shadow-md"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <div className="flex flex-col md:flex-row items-center">
              <div className="relative mb-4 md:mb-0 md:mr-8">
                <div className="h-24 w-24 md:h-40 md:w-40 rounded-full bg-gray-200 overflow-hidden border-4 border-white flex items-center justify-center">
                  {user?.photo ? (
                    <img
                      src={user?.photo}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={64} style={{ color: "var(--color-icons)" }} />
                  )}
                </div>
                <button
                  className="absolute bottom-0 right-0 p-2 rounded-full"
                  style={{
                    backgroundColor: "var(--color-secondary)",
                    color: "white",
                  }}
                >
                  <Camera size={16} />
                </button>
              </div>

              <div className="w-full flex text-center md:text-left flex-wrap lg:flex-row justify-between">
                <div>
                  <h1
                    className="text-3xl font-bold mb-1"
                    style={{ color: "var(--color-title)" }}
                  >
                    {user?.name || "User Name"}
                  </h1>
                  <p
                    className="text-lg mb-4"
                    style={{ color: "var(--color-text)" }}
                  >
                    {user?.email || "user@example.com"}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-[120px] h-[50px] justify-center rounded-md text-base font-medium shadow-sm flex items-center bg-white hover:text-white hover:bg-secondary transition-all duration-200"
                  style={{
                    border: "1px solid",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Profile Navigation */}
          <div
            className="mb-8 border-b overflow-hidden"
            style={{ borderColor: "var(--color-border)" }}
          >
            <nav className="flex flex-wrap md:flex-nowrap">
              <Link
                to="/profile"
                className={`flex-1 md:flex-none px-5 py-4 font-medium text-base flex items-center justify-center md:justify-start ${
                  location.pathname === "/profile" ? "border-b-2" : ""
                }`}
                style={{
                  color:
                    location.pathname === "/profile"
                      ? "var(--color-secondary)"
                      : "var(--color-text)",
                  borderColor: "var(--color-secondary)",
                }}
              >
                <User size={20} className="mr-2" />
                <span className="truncate">Personal Info</span>
              </Link>
              <Link
                to="/profile/orders"
                className={`flex-1 md:flex-none px-5 py-4 font-medium text-base flex items-center justify-center md:justify-start ${
                  location.pathname === "/profile/orders" ? "border-b-2" : ""
                }`}
                style={{
                  color:
                    location.pathname === "/profile/orders"
                      ? "var(--color-secondary)"
                      : "var(--color-text)",
                  borderColor: "var(--color-secondary)",
                }}
              >
                <Package size={20} className="mr-2" />
                <span className="truncate">Orders</span>
              </Link>
              <Link
                to="/profile/wishlist"
                className={`flex-1 md:flex-none px-5 py-4 font-medium text-base flex items-center justify-center md:justify-start ${
                  location.pathname === "/profile/wishlist" ? "border-b-2" : ""
                }`}
                style={{
                  color:
                    location.pathname === "/profile/wishlist"
                      ? "var(--color-secondary)"
                      : "var(--color-text)",
                  borderColor: "var(--color-secondary)",
                }}
              >
                <Heart size={20} className="mr-2" />
                <span className="truncate">Wishlist</span>
              </Link>
              <Link
                to="/profile/settings"
                className={`flex-1 md:flex-none px-5 py-4 font-medium text-base flex items-center justify-center md:justify-start ${
                  location.pathname === "/profile/settings" ? "border-b-2" : ""
                }`}
                style={{
                  color:
                    location.pathname === "/profile/settings"
                      ? "var(--color-secondary)"
                      : "var(--color-text)",
                  borderColor: "var(--color-secondary)",
                }}
              >
                <Settings size={20} className="mr-2" />
                <span className="truncate">Settings</span>
              </Link>
            </nav>
          </div>

          {/* Profile Content Area */}
          <div
            className="bg-white rounded-lg shadow-md p-6 md:p-8"
            style={{ borderColor: "var(--color-border)" }}
          >
            <Outlet context={{ user }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
