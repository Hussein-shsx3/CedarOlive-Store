import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
  Loader,
  Upload,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { updateMe } from "../../api/users/userApi";
import { useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

const PersonalInformation = () => {
  const { user } = useOutletContext();
  console.log(user);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Update form data whenever user prop changes
  useEffect(() => {
    // Handle user data loading state
    if (user === undefined) {
      setIsLoading(true);
      return;
    }

    setIsLoading(false);

    // Only update form if user exists
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });

      // Set photo preview if user has a photo
      if (user.photo) {
        setPhotoPreview(user.photo);
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size should be less than 5MB!", {
        position: "top-right",
        autoClose: 3000,
      });
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setPhoto(file);

    // Create a preview URL for the selected image
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      // Create a FormData object to handle file upload
      const submitData = new FormData();

      // Append text fields
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone || "");
      submitData.append("address", formData.address || "");

      // Only append photo if a new one was selected
      if (photo) {
        submitData.append("photo", photo);
      }

      const result = await dispatch(updateMe(submitData)).unwrap();

      if (result && result.status === "success") {
        toast.success("Profile updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });

        // Invalidate and refetch user data
        await queryClient.invalidateQueries({
          queryKey: ["currentUser"],
          exact: true,
        });
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(user?.photo || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader
          size={40}
          className="animate-spin mb-4"
          style={{ color: "var(--color-secondary)" }}
        />
        <p
          className="text-lg font-medium"
          style={{ color: "var(--color-title)" }}
        >
          Loading user information...
        </p>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
        <form onSubmit={handleSubmit} encType="multipart/form-data">
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

          {/* Photo Upload Section */}
          <div className="mb-8">
            <label
              className="block mb-3 text-base font-medium"
              style={{ color: "var(--color-text)" }}
            >
              Profile Picture
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div
                className="w-32 h-32 rounded-full overflow-hidden border flex items-center justify-center"
                style={{ borderColor: "var(--color-border)" }}
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={48} style={{ color: "var(--color-icons)" }} />
                )}
              </div>
              <div className="flex flex-col gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  ref={fileInputRef}
                  name="photo"
                />
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="px-4 py-2 rounded-md text-base font-medium flex items-center"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-title)",
                  }}
                >
                  <Upload size={16} className="mr-2" />
                  Upload Image
                </button>
                {photoPreview && (
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="px-4 py-2 rounded-md text-base font-medium flex items-center"
                    style={{
                      backgroundColor: "white",
                      color: "var(--color-title)",
                      border: "1px solid",
                      borderColor: "var(--color-border)",
                    }}
                  >
                    <X size={16} className="mr-2" />
                    Remove Image
                  </button>
                )}
                <p className="text-sm" style={{ color: "var(--color-text)" }}>
                  Recommended: Square image, max size 5MB
                </p>
              </div>
            </div>
          </div>

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
                  value={formData.phone || ""}
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
                  value={formData.address || ""}
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
                  setPhotoPreview(user.photo || null);
                }
                setPhoto(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
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
          {/* Photo Display (View Mode) */}
          <div
            className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div
              className="w-32 h-32 rounded-full overflow-hidden border flex items-center justify-center"
              style={{ borderColor: "var(--color-border)" }}
            >
              {user?.photo ? (
                <img
                  src={user.photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={48} style={{ color: "var(--color-icons)" }} />
              )}
            </div>
            <div>
              <h3
                className="text-xl font-medium"
                style={{ color: "var(--color-title)" }}
              >
                {user?.name || "User Name"}
              </h3>
              <p className="text-base" style={{ color: "var(--color-text)" }}>
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>

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
