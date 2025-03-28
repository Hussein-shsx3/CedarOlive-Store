import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updatePassword } from "../../api/users/userApi";
import { Lock, EyeOff, Eye, Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

const ChangePassword = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    password: "",
    passwordConfirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset loading state
    setIsLoading(true);

    // Validation
    if (passwordData.password !== passwordData.passwordConfirm) {
      toast.error("New passwords do not match", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsLoading(false);
      return;
    }

    if (passwordData.password.length < 8) {
      toast.error("Password must be at least 8 characters long", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      await dispatch(updatePassword(passwordData)).unwrap();

      // Success toast
      toast.success("Password updated successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset form
      setPasswordData({
        currentPassword: "",
        password: "",
        passwordConfirm: "",
      });
    } catch (err) {
      // Error toast
      toast.error(
        err.message || "Failed to update password. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* ToastContainer for notifications */}
      <ToastContainer />

      <h2
        className="text-2xl font-bold mb-6"
        style={{ color: "var(--color-title)" }}
      >
        <Lock size={24} className="inline-block mr-3" />
        Change Password
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <label
            htmlFor="currentPassword"
            className="block mb-2"
            style={{ color: "var(--color-text)" }}
          >
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.currentPassword ? "text" : "password"}
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md border"
              style={{
                backgroundColor: "white",
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
              }}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("currentPassword")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              style={{ color: "var(--color-icons)" }}
              disabled={isLoading}
            >
              {showPasswords.currentPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label
            htmlFor="password"
            className="block mb-2"
            style={{ color: "var(--color-text)" }}
          >
            New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.newPassword ? "text" : "password"}
              id="password"
              name="password"
              value={passwordData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md border"
              style={{
                backgroundColor: "white",
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
              }}
              required
              minLength={8}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("newPassword")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              style={{ color: "var(--color-icons)" }}
              disabled={isLoading}
            >
              {showPasswords.newPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div>
          <label
            htmlFor="passwordConfirm"
            className="block mb-2"
            style={{ color: "var(--color-text)" }}
          >
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirmPassword ? "text" : "password"}
              id="passwordConfirm"
              name="passwordConfirm"
              value={passwordData.passwordConfirm}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md border"
              style={{
                backgroundColor: "white",
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
              }}
              required
              minLength={8}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirmPassword")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              style={{ color: "var(--color-icons)" }}
              disabled={isLoading}
            >
              {showPasswords.confirmPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full px-6 py-3 rounded-md font-semibold shadow-sm flex items-center justify-center"
            style={{
              backgroundColor: "var(--color-secondary)",
              color: "white",
              opacity: isLoading ? 0.7 : 1,
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
