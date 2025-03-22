import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Edit, Save, X, Loader } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateMe } from "../../api/users/userApi";
import { useQueryClient } from "@tanstack/react-query";

const PersonalInformation = ({ user }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await dispatch(updateMe(formData)).unwrap();

      await queryClient.invalidateQueries({
        queryKey: ["currentUser"],
        exact: true,
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--color-title)" }}
        >
          Personal Information
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 rounded-md text-base font-medium flex items-center"
            style={{
              backgroundColor: "var(--color-secondary)",
              color: "white",
            }}
          >
            <Edit size={16} className="mr-2" />
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          {isUpdating && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                <Loader
                  size={40}
                  className="animate-spin mb-4"
                  style={{ color: "var(--color-secondary)" }}
                />
                <p
                  className="text-lg font-medium"
                  style={{ color: "var(--color-title)" }}
                >
                  Updating profile...
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <label
                className="block mb-3 text-base font-medium"
                style={{ color: "var(--color-text)" }}
              >
                Full Name
              </label>
              <div
                className="flex items-center p-0 rounded-md border overflow-hidden"
                style={{ borderColor: "var(--color-border)" }}
              >
                <span
                  className="flex items-center justify-center h-full px-4 py-3 border-r"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <User size={20} style={{ color: "var(--color-icons)" }} />
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="p-4 flex-1 w-full outline-none text-base"
                  style={{ color: "var(--color-title)" }}
                />
              </div>
            </div>
            <div>
              <label
                className="block mb-3 text-base font-medium"
                style={{ color: "var(--color-text)" }}
              >
                Email Address
              </label>
              <div
                className="flex items-center p-0 rounded-md border overflow-hidden"
                style={{ borderColor: "var(--color-border)" }}
              >
                <span
                  className="flex items-center justify-center h-full px-4 py-3 border-r"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <Mail size={20} style={{ color: "var(--color-icons)" }} />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="p-4 flex-1 w-full outline-none text-base"
                  style={{ color: "var(--color-title)" }}
                />
              </div>
            </div>
            <div>
              <label
                className="block mb-3 text-base font-medium"
                style={{ color: "var(--color-text)" }}
              >
                Phone Number
              </label>
              <div
                className="flex items-center p-0 rounded-md border overflow-hidden"
                style={{ borderColor: "var(--color-border)" }}
              >
                <span
                  className="flex items-center justify-center h-full px-4 py-3 border-r"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <Phone size={20} style={{ color: "var(--color-icons)" }} />
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="p-4 flex-1 w-full outline-none text-base"
                  style={{ color: "var(--color-title)" }}
                />
              </div>
            </div>
            <div>
              <label
                className="block mb-3 text-base font-medium"
                style={{ color: "var(--color-text)" }}
              >
                Address
              </label>
              <div
                className="flex items-center p-0 rounded-md border overflow-hidden"
                style={{ borderColor: "var(--color-border)" }}
              >
                <span
                  className="flex items-center justify-center h-full px-4 py-3 border-r"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <MapPin size={20} style={{ color: "var(--color-icons)" }} />
                </span>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="p-4 flex-1 w-full outline-none text-base"
                  style={{ color: "var(--color-title)" }}
                />
              </div>
            </div>
          </div>

          <div
            className="flex space-x-4 pt-6 border-t"
            style={{ borderColor: "var(--color-border)" }}
          >
            <button
              type="submit"
              className="px-6 py-3 rounded-md text-base font-medium flex items-center"
              style={{
                backgroundColor: "var(--color-secondary)",
                color: "white",
              }}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader size={18} className="animate-spin mr-2" />
              ) : (
                <Save size={18} className="mr-2" />
              )}
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                // Reset form to current user data
                if (user) {
                  setFormData({
                    name: user.name || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    address: user.address || "",
                  });
                }
              }}
              className="px-6 py-3 rounded-md text-base font-medium flex items-center"
              style={{
                backgroundColor: "white",
                color: "var(--color-title)",
                border: "1px solid",
                borderColor: "var(--color-border)",
              }}
              disabled={isUpdating}
            >
              <X size={18} className="mr-2" />
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label
                className="block mb-3 text-base font-medium"
                style={{ color: "var(--color-text)" }}
              >
                Full Name
              </label>
              <div
                className="flex items-center p-4 rounded-md border"
                style={{ borderColor: "var(--color-border)" }}
              >
                <User
                  size={20}
                  style={{ color: "var(--color-icons)" }}
                  className="mr-3"
                />
                <span
                  className="text-base"
                  style={{ color: "var(--color-title)" }}
                >
                  {user?.name || "User Name"}
                </span>
              </div>
            </div>
            <div>
              <label
                className="block mb-3 text-base font-medium"
                style={{ color: "var(--color-text)" }}
              >
                Email Address
              </label>
              <div
                className="flex items-center p-4 rounded-md border"
                style={{ borderColor: "var(--color-border)" }}
              >
                <Mail
                  size={20}
                  style={{ color: "var(--color-icons)" }}
                  className="mr-3"
                />
                <span
                  className="text-base"
                  style={{ color: "var(--color-title)" }}
                >
                  {user?.email || "user@example.com"}
                </span>
              </div>
            </div>
            <div>
              <label
                className="block mb-3 text-base font-medium"
                style={{ color: "var(--color-text)" }}
              >
                Phone Number
              </label>
              <div
                className="flex items-center p-4 rounded-md border"
                style={{ borderColor: "var(--color-border)" }}
              >
                <Phone
                  size={20}
                  style={{ color: "var(--color-icons)" }}
                  className="mr-3"
                />
                <span
                  className="text-base"
                  style={{ color: "var(--color-title)" }}
                >
                  {user?.phone || "+1 (555) 123-4567"}
                </span>
              </div>
            </div>
            <div>
              <label
                className="block mb-3 text-base font-medium"
                style={{ color: "var(--color-text)" }}
              >
                Address
              </label>
              <div
                className="flex items-center p-4 rounded-md border"
                style={{ borderColor: "var(--color-border)" }}
              >
                <MapPin
                  size={20}
                  style={{ color: "var(--color-icons)" }}
                  className="mr-3"
                />
                <span
                  className="text-base"
                  style={{ color: "var(--color-title)" }}
                >
                  {user?.address || "123 Main St, City, State 12345"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInformation;

