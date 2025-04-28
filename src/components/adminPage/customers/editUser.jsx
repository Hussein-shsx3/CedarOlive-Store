import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserById, updateUserById } from "../../../api/users/userApi";
import { resetUserStatus } from "../../../redux/userSlice";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";

const EditUserPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.user);

  // Get user data
  const {
    data: user,
    isLoading,
    isError,
    error: fetchError,
  } = useGetUserById(userId);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isDirty, setIsDirty] = useState(false);

  // Initialize form data
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

  // Handle update status changes
  useEffect(() => {
    if (status === "succeeded") {
      toast.success("User updated successfully!");
      dispatch(resetUserStatus());
    }
    if (status === "failed") {
      toast.error(error || "Failed to update user");
    }
  }, [status, error, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsDirty(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isDirty) return;

    dispatch(
      updateUserById({
        userId,
        userData: formData,
      })
    );
  };

  const handleGoBack = () => navigate("/admin/customers");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
        <div className="bg-white rounded-lg p-6 max-w-md w-full text-center border border-gray-200 shadow-sm">
          <Loader2 className="animate-spin text-[#A0522D] w-12 h-12 mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
        <div className="bg-white rounded-lg p-6 max-w-md w-full text-center border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            {isError ? "Error" : "User Not Found"}
          </h2>
          <p className="text-gray-600 mb-6">
            {fetchError?.message || "The specified user could not be found."}
          </p>
          <button
            onClick={handleGoBack}
            className="bg-[#A0522D] text-white px-4 py-2 rounded hover:bg-[#8B4513] transition flex items-center justify-center mx-auto"
          >
            <ArrowLeft className="mr-2" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">

      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleGoBack}
          className="flex items-center text-[#A0522D] hover:text-[#8B4513] mb-6 transition"
        >
          <ArrowLeft className="mr-2" /> Back to Users
        </button>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-gray-200 shadow-sm"
        >
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold flex items-center text-gray-800">
              <User className="mr-2 text-[#A0522D]" /> Edit User Details
            </h2>
            {!isDirty && (
              <p className="text-sm text-gray-500 mt-1">
                Current user information is displayed below
              </p>
            )}
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Full Name"
                Icon={User}
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <InputField
                label="Email Address"
                Icon={Mail}
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <InputField
                label="Phone Number"
                Icon={Phone}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <TextareaField
                label="Address"
                Icon={MapPin}
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={!isDirty || status === "loading"}
                className={`bg-[#A0522D] text-white px-6 py-3 rounded-lg hover:bg-[#8B4513] transition flex items-center ${
                  !isDirty || status === "loading"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {status === "loading" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2" />
                )}
                Update User
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reusable Input Field Component
const InputField = ({ label, Icon, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="text-[#A0522D] w-5 h-5" />
      </div>
      <input
        {...props}
        className="pl-10 w-full h-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A0522D] focus:border-[#A0522D] hover:border-gray-400 transition"
      />
    </div>
  </div>
);

const TextareaField = ({ label, Icon, ...props }) => (
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute top-3 left-3 pointer-events-none">
        <Icon className="text-[#A0522D] w-5 h-5" />
      </div>
      <textarea
        {...props}
        rows={3}
        className="pl-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A0522D] focus:border-[#A0522D] hover:border-gray-400 transition"
      />
    </div>
  </div>
);

export default EditUserPage;
