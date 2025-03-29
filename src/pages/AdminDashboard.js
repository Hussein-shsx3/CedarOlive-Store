import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  Bell,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import { Link, Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGetCurrentUser } from "../api/users/userApi";
import { logout } from "../redux/authSlice";
import { useDispatch } from "react-redux";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: user } = useGetCurrentUser();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setIsSidebarOpen(false);
      } else if (width >= 768 && width < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
      if (width >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const NavItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Dashboard",
      to: "/admin/dashboard",
    },
    {
      icon: <Package className="w-5 h-5" />,
      label: "Products",
      to: "/admin/products",
    },
    {
      icon: <ShoppingCart className="w-5 h-5" />,
      label: "Orders",
      to: "/admin/orders",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Customers",
      to: "/admin/customers",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      to: "/admin/settings",
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signIn");
  };

  return (
    <div className="flex h-screen bg-[#f7f3f3] text-[#131313] overflow-hidden">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md md:hidden z-40">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="mr-4 text-[#6b7280] hover:text-[#A0522D]"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {user?.photo ? (
                <img
                  src={user.photo}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={64} className="text-icons p-2" />
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative text-[#6b7280] hover:text-[#A0522D]">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-[#A0522D] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween" }}
            className="fixed inset-0 bg-white z-50 w-64"
          >
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-[#e2e8f0]">
                <Link to="/">
                  <img
                    src="https://cdn.prod.website-files.com/629f3db942b81a5f49ac7ba9/62c4923d2a7ada5125407697_logo.svg"
                    alt="Logo"
                    className="w-32"
                  />
                </Link>
                <button
                  onClick={toggleMobileMenu}
                  className="text-[#6b7280] hover:text-[#A0522D]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 py-4 overflow-y-auto">
                {NavItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={toggleMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 text-[#8a8888] hover:bg-[#A0522D]/10 hover:text-[#A0522D] transition-colors group ${
                        isActive ? "bg-[#A0522D]/10 text-[#A0522D]" : ""
                      }`
                    }
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span className="text-sm">{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="p-4 border-t border-[#e2e8f0]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src="/api/placeholder/40/40"
                      alt="Admin"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#131313]">
                        {user?.name}
                      </p>
                      <p className="text-xs text-[#8a8888]">Admin</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to="/profile"
                      className="text-[#6b7280] hover:text-[#A0522D]"
                    >
                      <User className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-[#6b7280] hover:text-red-600"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-[#ede5de] transition-all duration-300 ease-in-out border-r border-[#e2e8f0] flex flex-col shadow-lg hidden md:flex`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#e2e8f0]">
          {isSidebarOpen && (
            <Link to="/">
              <img
                src="https://cdn.prod.website-files.com/629f3db942b81a5f49ac7ba9/62c4923d2a7ada5125407697_logo.svg"
                alt="Logo"
                className="w-32"
              />
            </Link>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-[#6b7280] hover:text-[#A0522D] transition-colors"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {NavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-[#8a8888] hover:bg-[#A0522D]/10 hover:text-[#A0522D] transition-colors group ${
                  isActive ? "bg-[#A0522D]/10 text-[#A0522D]" : ""
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {isSidebarOpen && <span className="text-sm">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop Header */}
        <header className="hidden md:flex bg-white shadow-md border-b border-[#e2e8f0] px-6 py-4 justify-end items-center">
          <div className="flex items-center space-x-4">
            <button className="relative text-[#6b7280] hover:text-[#A0522D]">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-[#A0522D] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>

            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 hover:bg-[#ede5de] p-2 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {user?.photo ? (
                    <img
                      src={user.photo}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={64} className="text-icons p-2" />
                  )}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-[#131313]">
                    {user?.name}
                  </p>
                  <p className="text-xs text-[#8a8888]">Admin</p>
                </div>
                <ChevronDown className="w-4 h-4 text-[#6b7280]" />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#e2e8f0] rounded-lg shadow-lg z-10">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-[#131313] hover:bg-[#ede5de]"
                  >
                    <User className="w-4 h-4 mr-2" /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm text-[#A0522D] hover:bg-[#ede5de] w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f7f3f3] p-2 md:p-6 mt-16 md:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
