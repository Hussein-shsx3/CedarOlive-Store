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
      console.log("Submitting Data:", formData); // Debugging Log
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

      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-title mb-3">
              Get in Touch
            </h1>
            <p className="text-text text-lg max-w-xl mx-auto">
              We'd love to hear from you. Fill out the form or use our contact
              information below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information Section */}
            <div className="space-y-10 order-2 lg:order-1">
              <div className="bg-primary/10 p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold text-title mb-6">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  <div className="flex items-center p-3 hover:bg-secondary/10 rounded-lg transition-colors duration-300">
                    <div className="bg-secondary/20 p-3 rounded-full">
                      <Mail className="w-6 h-6 text-secondary" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-text font-medium">Email</p>
                      <p className="text-title font-medium">
                        contact@yourcompany.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 hover:bg-secondary/10 rounded-lg transition-colors duration-300">
                    <div className="bg-secondary/20 p-3 rounded-full">
                      <Phone className="w-6 h-6 text-secondary" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-text font-medium">Phone</p>
                      <p className="text-title font-medium">
                        +1 (555) 123-4567
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 hover:bg-secondary/10 rounded-lg transition-colors duration-300">
                    <div className="bg-secondary/20 p-3 rounded-full">
                      <MapPin className="w-6 h-6 text-secondary" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-text font-medium">Address</p>
                      <p className="text-title font-medium">
                        123 Business Street, City, Country
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold text-title mb-6">
                  Business Hours
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-text">Monday - Friday</span>
                    <span className="text-title font-medium">
                      9:00 AM - 5:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text">Saturday</span>
                    <span className="text-title font-medium">
                      10:00 AM - 2:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text">Sunday</span>
                    <span className="text-title font-medium">Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Section */}
            <div className="order-1 lg:order-2">
              <div className="bg-primary rounded-xl shadow-xl p-8">
                <h2 className="text-2xl font-semibold text-title mb-6">
                  Send a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-title"
                    >
                      Your Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                        className={`w-full px-4 py-3 border border-border rounded-lg 
                          focus:outline-none focus:ring-2 focus:ring-secondary 
                          transition-all duration-300 bg-background 
                          text-title placeholder-text
                          ${
                            validationErrors.name
                              ? "border-red-500 focus:ring-red-500"
                              : ""
                          }`}
                      />
                    </div>
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
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email address"
                        className={`w-full px-4 py-3 border border-border rounded-lg 
                          focus:outline-none focus:ring-2 focus:ring-secondary 
                          transition-all duration-300 bg-background 
                          text-title placeholder-text
                          ${
                            validationErrors.email
                              ? "border-red-500 focus:ring-red-500"
                              : ""
                          }`}
                      />
                    </div>
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
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Type your message here..."
                      className={`w-full px-4 py-3 border border-border rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-secondary 
                        transition-all duration-300 resize-none bg-background 
                        text-title placeholder-text
                        ${
                          validationErrors.message
                            ? "border-red-500 focus:ring-red-500"
                            : ""
                        }`}
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
