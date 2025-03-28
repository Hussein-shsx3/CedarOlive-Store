import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetUserById } from "../../../api/users/userApi";
import { updateUserById } from "../../../api/users/userApi";
import { User, Mail, Phone, MapPin, Save, Loader2 } from "lucide-react";

const EditUserPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  // Use the React Query hook to fetch user data
  const { data: user, isLoading, isError, error } = useGetUserById(userId);

  // Initialize form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Populate form with existing user data when data is fetched
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Perform user update
      await updateUserById({
        userId,
        userData: formData,
      });

      // Navigate back to users list or dashboard
      navigate("/admin/users");
    } catch (error) {
      console.error("Failed to update user", error);
      // Optionally, you could set an error state to show to the user
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="flex items-center text-[#A0522D]">
          <Loader2 className="animate-spin mr-2" />
          <span>Loading user data...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-red-600">
            Error Loading User
          </h2>
          <p>
            {error?.message || "An error occurred while fetching user data"}
          </p>
        </div>
      </div>
    );
  }

  // If no user found
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-red-600">
            User Not Found
          </h2>
          <p>The specified user could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-6 text-[#A0522D]">
          Edit User Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              <User className="inline-block mr-2 text-[#A0522D]" /> Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A0522D] focus:ring focus:ring-[#A0522D]/50"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              <Mail className="inline-block mr-2 text-[#A0522D]" /> Email
              Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A0522D] focus:ring focus:ring-[#A0522D]/50"
              required
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              <Phone className="inline-block mr-2 text-[#A0522D]" /> Phone
              Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A0522D] focus:ring focus:ring-[#A0522D]/50"
            />
          </div>

          {/* Address Field */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              <MapPin className="inline-block mr-2 text-[#A0522D]" /> Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A0522D] focus:ring focus:ring-[#A0522D]/50"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-[#A0522D] text-white py-3 rounded-md hover:bg-[#8B4513] transition-colors flex items-center justify-center"
          >
            <Save className="inline-block mr-2" /> Update User Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserPage;
