import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updatePassword, deleteMe } from "../../api/users/userApi";
import {
  Eye,
  EyeOff,
  Loader2,
  Shield,
  Lock,
  AlertTriangle,
  LogOut,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { logout } from "../../redux/authSlice";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const cookies = new Cookies();

const AccountSettings = () => {
  // State management
  const [activeTab, setActiveTab] = useState("password");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    password: "",
    passwordConfirm: "",
  });
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    password: false,
    passwordConfirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [isSuspendLoading, setIsSuspendLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (passwordData.password !== passwordData.passwordConfirm) {
      toast.error("New passwords do not match");
      setIsLoading(false);
      return;
    }

    if (passwordData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      await dispatch(updatePassword(passwordData)).unwrap();
      toast.success("Password updated successfully");
      setPasswordData({
        currentPassword: "",
        password: "",
        passwordConfirm: "",
      });
    } catch (err) {
      toast.error(
        err.message || "Failed to update password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuspendAccount = async () => {
    setIsSuspendLoading(true);
    try {
      await dispatch(deleteMe()).unwrap();
      toast.success(
        "Your account has been suspended. You will be logged out shortly."
      );
      setTimeout(() => {
        dispatch(logout());
        cookies.remove("token");
        navigate("/signin");
      }, 3000);
    } catch (err) {
      toast.error(
        err.message || "Failed to suspend account. Please try again."
      );
    } finally {
      setIsSuspendLoading(false);
      setShowSuspendModal(false);
    }
  };

  return (
    <div className="max-w-full mx-auto">
      <ToastContainer />

      <div className="flex items-center mb-8">
        <div className="text-2xl font-medium text-gray-800">
          Account Settings
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center md:justify-around border-b mb-6">
        <button
          className={`px-8 py-3 flex items-center ${
            activeTab === "password"
              ? "border-b-2 border-amber-700 text-amber-700"
              : "text-gray-600 hover:text-amber-700"
          }`}
          onClick={() => setActiveTab("password")}
        >
          <Lock size={18} className="mr-2" />
          Password
        </button>
        <button
          className={`px-8 py-3 flex items-center ${
            activeTab === "security"
              ? "border-b-2 border-amber-700 text-amber-700"
              : "text-gray-600 hover:text-amber-700"
          }`}
          onClick={() => setActiveTab("security")}
        >
          <Shield size={18} className="mr-2" />
          Security
        </button>
      </div>

      {/* Password Tab */}
      {activeTab === "password" && (
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="currentPassword"
                className="block mb-2 text-gray-600"
              >
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.currentPassword ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("currentPassword")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword.currentPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-gray-600">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.password ? "text" : "password"}
                  id="password"
                  name="password"
                  value={passwordData.password}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                  minLength={8}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("password")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword.password ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              <p className="text-sm mt-1 text-gray-500">
                Must be at least 8 characters long
              </p>
            </div>

            <div>
              <label
                htmlFor="passwordConfirm"
                className="block mb-2 text-gray-600"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.passwordConfirm ? "text" : "password"}
                  id="passwordConfirm"
                  name="passwordConfirm"
                  value={passwordData.passwordConfirm}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                  minLength={8}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("passwordConfirm")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword.passwordConfirm ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full p-3 bg-amber-700 text-white rounded-md font-medium hover:bg-amber-800 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Updating...
                  </div>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Account Management
            </h3>
            <p className="text-gray-600 mb-6">
              Suspending your account will temporarily disable all access to
              your profile, orders, and payment information until you choose to
              reactivate it.
            </p>

            <button
              onClick={() => setShowSuspendModal(true)}
              className="flex items-center justify-center px-6 py-3 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
            >
              <AlertTriangle size={18} className="mr-2" />
              Suspend Account
            </button>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Sessions</h3>
            <p className="text-gray-600 mb-6">
              Sign out from all other devices where you're currently logged in.
            </p>

            <button className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
              <LogOut size={18} className="mr-2" />
              Sign Out from All Devices
            </button>
          </div>
        </div>
      )}

      {/* Suspension Confirmation Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-medium text-gray-800 mb-4">
              Suspend Your Account?
            </h3>
            <p className="mb-6 text-gray-600">
              This action will temporarily disable your account. You won't be
              able to access your profile, orders, or payment information until
              you reactivate it. Are you sure you want to proceed?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowSuspendModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50"
                disabled={isSuspendLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSuspendAccount}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition-colors"
                disabled={isSuspendLoading}
              >
                {isSuspendLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Processing...
                  </div>
                ) : (
                  "Suspend Account"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
