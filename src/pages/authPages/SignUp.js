import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { signUp } from "../../api/auth/authApi";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Manage local form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    address: "",
  });

  // For error handling/validation messages
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("token");

    if (token) {
      navigate("/");
    }
  }, [navigate]);

  // Calculate password strength when password changes
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (formData.password.length >= 8) strength += 1;
    if (/[A-Z]/.test(formData.password)) strength += 1;
    if (/[0-9]/.test(formData.password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;

    setPasswordStrength(strength);
  }, [formData.password]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear the specific error when user starts typing again
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  // Get strength label
  const getStrengthLabel = () => {
    switch (passwordStrength) {
      case 0:
        return "Very weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  };

  // Get strength color
  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 1:
        return "#ef4444"; // red
      case 2:
        return "#f97316"; // orange
      case 3:
        return "#3b82f6"; // blue
      case 4:
        return "#10b981"; // green
      default:
        return "#d1d5db"; // gray
    }
  };

  // Helper function to get common props for form fields
  const getFormControlProps = (
    fieldName,
    isRequired = false,
    fieldType = "text"
  ) => ({
    type: fieldType,
    id: fieldName,
    name: fieldName,
    value: formData[fieldName],
    onChange: handleChange,
    disabled: isSubmitting,
    required: isRequired,
    className: `w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all ${
      isSubmitting ? "bg-gray-100" : ""
    }`,
    style: {
      color: "var(--color-title, #131313)",
      backgroundColor: isSubmitting
        ? "rgba(243, 244, 246, 0.7)"
        : "rgba(255, 255, 255, 0.7)",
      borderColor: errors[fieldName]
        ? "#ef4444"
        : "var(--color-border, #e2e8f0)",
      borderWidth: "1px",
      "--tw-ring-color": "var(--color-secondary, #a87048)",
    },
  });

  // Perform client-side validations and dispatch the signUp async thunk
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    // Validate required fields
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (passwordStrength < 3) {
      newErrors.password = "Please use a stronger password";
    }

    // Confirm password
    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Build the payload according to backend expectations
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      passwordConfirm: formData.passwordConfirm,
      phone: formData.phone,
      address: formData.address,
    };

    setIsSubmitting(true);
    try {
      await dispatch(signUp(payload)).unwrap();
      // After successful signup, show verification message
      setErrors({
        form: "Verification email sent! Please check your inbox.",
      });
      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
        phone: "",
        address: "",
      });
    } catch (error) {
      console.error("Error during sign-up:", error);
      setErrors({
        form:
          error.message ||
          "An error occurred during sign up. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-8 bg-background">
      <div className="rounded-xl shadow-lg p-8 w-full max-w-2xl bg-white relative">
        {/* Form Loading Overlay */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-xl">
            <div className="text-center">
              <svg
                className="animate-spin h-10 w-10 mx-auto"
                style={{ color: "var(--color-secondary, #a87048)" }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p
                className="mt-3 text-sm font-medium"
                style={{ color: "var(--color-secondary, #a87048)" }}
              >
                Creating your account...
              </p>
            </div>
          </div>
        )}

        <div className="sm:mx-auto sm:w-full sm:max-w-md mb-9">
          <Link to="/" className="flex justify-center">
            <img
              src="https://cdn.prod.website-files.com/629f3db942b81a5f49ac7ba9/62c4923d2a7ada5125407697_logo.svg"
              alt="Logo"
              className="w-32"
            />
          </Link>
          <h2
            className="mt-6 text-center text-3xl font-medium"
            style={{ color: "var(--color-title, #131313)" }}
          >
            Create a new account
          </h2>
        </div>

        {errors.form && (
          <div
            className="p-4 mb-6 rounded-lg text-center"
            style={{
              backgroundColor: errors.form.includes("Verification")
                ? "rgba(209, 250, 229, 0.5)" // Light green for success
                : "rgba(254, 226, 226, 0.5)", // Light red for errors
              color: errors.form.includes("Verification")
                ? "#059669" // Green text for success
                : "#ef4444", // Red text for errors
            }}
          >
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium"
              style={{ color: "var(--color-title, #131313)" }}
            >
              Full Name *
            </label>
            <input {...getFormControlProps("name", true)} />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium"
              style={{ color: "var(--color-title, #131313)" }}
            >
              Email Address *
            </label>
            <input {...getFormControlProps("email", true, "email")} />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium"
              style={{ color: "var(--color-title, #131313)" }}
            >
              Password *
            </label>
            <input {...getFormControlProps("password", true, "password")} />

            {formData.password && (
              <div className="mt-2">
                <div className="flex justify-between mb-1">
                  <span style={{ color: "var(--color-text, #8a8888)" }}>
                    Password strength:
                  </span>
                  <span style={{ color: getStrengthColor() }}>
                    {getStrengthLabel()}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${passwordStrength * 25}%`,
                      backgroundColor: getStrengthColor(),
                    }}
                  ></div>
                </div>
                <ul
                  className="mt-2 text-xs space-y-1"
                  style={{ color: "var(--color-text, #8a8888)" }}
                >
                  <li
                    className={
                      formData.password.length >= 8 ? "text-green-500" : ""
                    }
                  >
                    • At least 8 characters
                  </li>
                  <li
                    className={
                      /[A-Z]/.test(formData.password) ? "text-green-500" : ""
                    }
                  >
                    • At least one uppercase letter
                  </li>
                  <li
                    className={
                      /[0-9]/.test(formData.password) ? "text-green-500" : ""
                    }
                  >
                    • At least one number
                  </li>
                  <li
                    className={
                      /[^A-Za-z0-9]/.test(formData.password)
                        ? "text-green-500"
                        : ""
                    }
                  >
                    • At least one special character
                  </li>
                </ul>
              </div>
            )}

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="passwordConfirm"
              className="block mb-2 text-sm font-medium"
              style={{ color: "var(--color-title, #131313)" }}
            >
              Confirm Password *
            </label>
            <input
              {...getFormControlProps("passwordConfirm", true, "password")}
            />
            {errors.passwordConfirm && (
              <p className="mt-1 text-sm text-red-500">
                {errors.passwordConfirm}
              </p>
            )}
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="phone"
                className="text-sm font-medium"
                style={{ color: "var(--color-title, #131313)" }}
              >
                Phone Number
              </label>
              <span
                className="text-xs italic"
                style={{ color: "var(--color-text, #8a8888)" }}
              >
                (Optional)
              </span>
            </div>
            <input {...getFormControlProps("phone", false, "tel")} />
            <p
              className="mt-1 text-xs"
              style={{ color: "var(--color-text, #8a8888)" }}
            >
              You can add your phone number later in your profile settings
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="address"
                className="text-sm font-medium"
                style={{ color: "var(--color-title, #131313)" }}
              >
                Address
              </label>
              <span
                className="text-xs italic"
                style={{ color: "var(--color-text, #8a8888)" }}
              >
                (Optional)
              </span>
            </div>
            <input {...getFormControlProps("address")} />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 font-medium rounded-lg text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-70"
            style={{
              backgroundColor: "var(--color-secondary, #a87048)",
              "--tw-ring-color": "var(--color-secondary, #a87048)",
            }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>

          <p
            className="text-center mt-6 text-sm"
            style={{ color: "var(--color-text, #8a8888)" }}
          >
            Already have an account?{" "}
            <Link
              to="/signin"
              className={`font-medium hover:underline ${
                isSubmitting ? "pointer-events-none opacity-70" : ""
              }`}
              style={{ color: "var(--color-secondary, #a87048)" }}
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
