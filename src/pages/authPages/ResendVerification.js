import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { resendVerification } from "../../api/auth/authApi";

const ResendVerification = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the email from URL query params if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);

  const { loading, resendSuccess, resendError } = useSelector(
    (state) => state.auth
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      dispatch(resendVerification(email));
      setSubmitted(true);
    }
  };

  const handleBackToLogin = () => {
    navigate("/signIn");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f3f3]">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 m-4">
        <h1 className="text-2xl font-bold mb-6 text-center text-[#131313]">
          Resend Verification Email
        </h1>

        {!submitted ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 rounded-md border border-[#e2e8f0] placeholder-[#8a8888] focus:outline-none focus:ring-2 focus:ring-[#a87048] focus:border-[#a87048]"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-md bg-[#a87048] hover:bg-[#8a5c3d] text-white font-medium transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </div>
                ) : (
                  "Resend Verification Email"
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {resendSuccess ? (
              <div className="flex items-center justify-center text-[#a87048] mb-4">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Verification email sent successfully!</span>
              </div>
            ) : (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {resendError || "Something went wrong. Please try again."}
              </div>
            )}

            <div className="text-center">
              <button
                onClick={handleBackToLogin}
                className="text-[#a87048] hover:text-[#8a5c3d] font-medium"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-[#8a8888]">
            If you're having trouble receiving the verification email, please
            check your spam folder or contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResendVerification;
