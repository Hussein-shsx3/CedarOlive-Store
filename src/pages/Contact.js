import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetContactForm } from "../redux/contactSlice";
import { sendContactMessage } from "../api/contact/contactApi";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import ScrollToTop from "../components/scrollToTop";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const Contact = () => {
  const dispatch = useDispatch();
  const { isSubmitting, isSuccess, error } = useSelector(
    (state) => state.contact
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      dispatch(sendContactMessage(formData));
    }
  };

  // Reset form after successful submission
  useEffect(() => {
    if (isSuccess) {
      setFormData({
        name: "",
        email: "",
        message: "",
      });

      const timer = setTimeout(() => {
        dispatch(resetContactForm());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, dispatch]);

  return (
    <div className="flex flex-col justify-center items-center">
      <ScrollToTop />
      <Header />
      <div className="min-h-screen bg-background flex flex-col">
        <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row gap-12 items-center justify-center">
          {/* Contact Information Section */}
          <div className="w-full md:w-1/2 space-y-8">
            <div>
              <h1 className="text-4xl font-medium mb-4 text-title">
                Get in Touch
              </h1>
              <p className="text-base text-text">
                We'd love to hear from you. Fill out the form or use our contact
                information.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Mail className="w-6 h-6 text-secondary" />
                <span className="text-base text-title">
                  contact@yourcompany.com
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="w-6 h-6 text-secondary" />
                <span className="text-base text-title">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="w-6 h-6 text-secondary" />
                <span className="text-base text-title">
                  123 Business Street, City, Country
                </span>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="w-full md:w-1/2 bg-primary rounded-xl shadow-xl p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-title"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Full Name"
                  className={`w-full px-4 py-3 border border-border rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-secondary 
                    transition-all duration-300 bg-background 
                    text-title placeholder-text
                    ${validationErrors.name ? "border-red-500" : ""}`}
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    {validationErrors.name}
                  </p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-title"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  className={`w-full px-4 py-3 border border-border rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-secondary 
                    transition-all duration-300 bg-background 
                    text-title placeholder-text
                    ${validationErrors.email ? "border-red-500" : ""}`}
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    {validationErrors.email}
                  </p>
                )}
              </div>

              {/* Message Textarea */}
              <div>
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-medium text-title"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Type your message here..."
                  className={`w-full px-4 py-3 border border-border rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-secondary 
                    transition-all duration-300 resize-none bg-background 
                    text-title placeholder-text
                    ${validationErrors.message ? "border-red-500" : ""}`}
                />
                {validationErrors.message && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    {validationErrors.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-lg text-lg font-semibold 
                  bg-secondary text-white 
                  transform hover:scale-105 transition-all duration-300 
                  hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>

              {/* Success Message */}
              {isSuccess && (
                <div
                  className="bg-green-50 border border-green-200 text-green-700 
                  px-4 py-3 rounded-lg flex items-center mt-4"
                >
                  <CheckCircle className="w-6 h-6 mr-3" />
                  <p>Thank you! Your message has been sent successfully.</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div
                  className="bg-red-50 border border-red-200 text-red-700 
                  px-4 py-3 rounded-lg flex items-center mt-4"
                >
                  <AlertTriangle className="w-6 h-6 mr-3" />
                  <p>{error}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
