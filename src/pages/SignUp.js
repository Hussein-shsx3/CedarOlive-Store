import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signUp } from "../api/authApi";
import { Link } from "react-router-dom";

const SignUp = () => {
  const dispatch = useDispatch();

  // Manage local form state (removed role and isVerified)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    avatar: null,
    address: "",
  });

  // For error handling/validation messages
  const [errors, setErrors] = useState({});

  // Track if a file is selected
  const [fileName, setFileName] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files.length > 0) {
      setFormData({ ...formData, avatar: files[0] });
      setFileName(files[0].name);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Perform client-side validations and dispatch the signUp async thunk
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    // Validate required fields
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Build the payload (role and isVerified are now handled server-side)
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      avatar: formData.avatar,
      address: formData.address,
    };

    try {
      await dispatch(signUp(payload)).unwrap();
      // Redirect logic would go here after successful sign-up.
    } catch (error) {
      console.error("Error during sign-up:", error);
      // Optionally handle error display here.
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-2xl">
        <div className="sm:mx-auto sm:w-full sm:max-w-md mb-9">
          <Link to="/" className="flex justify-center">
            <img
              src="https://cdn.prod.website-files.com/629f3db942b81a5f49ac7ba9/62c4923d2a7ada5125407697_logo.svg"
              alt="Logo"
              className="w-32"
            />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-medium text-gray-700">
            Create a new account
          </h2>
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="firstName"
                className="block mb-2 text-sm font-medium text-[#131313]"
              >
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.firstName ? "border-red-500" : "border-[#e2e8f0]"
                } focus:outline-none focus:ring-2 focus:ring-[#a87048] focus:ring-opacity-50 text-[#131313]`}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block mb-2 text-sm font-medium text-[#131313]"
              >
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.lastName ? "border-red-500" : "border-[#e2e8f0]"
                } focus:outline-none focus:ring-2 focus:ring-[#a87048] focus:ring-opacity-50 text-[#131313]`}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-[#131313]"
            >
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.email ? "border-red-500" : "border-[#e2e8f0]"
              } focus:outline-none focus:ring-2 focus:ring-[#a87048] focus:ring-opacity-50 text-[#131313]`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-[#131313]"
            >
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.password ? "border-red-500" : "border-[#e2e8f0]"
              } focus:outline-none focus:ring-2 focus:ring-[#a87048] focus:ring-opacity-50 text-[#131313]`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block mb-2 text-sm font-medium text-[#131313]"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-[#a87048] focus:ring-opacity-50 text-[#131313]"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="address"
              className="block mb-2 text-sm font-medium text-[#131313]"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-[#a87048] focus:ring-opacity-50 text-[#131313]"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-[#131313]">
              Profile Picture
            </label>
            <div className="relative">
              <label
                htmlFor="avatar"
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[#e2e8f0] bg-[#ede5de] cursor-pointer"
              >
                <span className="text-[#a87048] font-medium">Choose File</span>
                <span className="text-[#8a8888] truncate">
                  {fileName || "No file selected"}
                </span>
              </label>
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
                className="sr-only"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#a87048] hover:bg-[#95613e] text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Sign Up
          </button>

          <p className="text-center mt-6 text-[#8a8888] text-sm">
            Already have an account?{" "}
            <a
              href="/signIn"
              className="text-[#a87048] font-medium hover:underline"
            >
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
