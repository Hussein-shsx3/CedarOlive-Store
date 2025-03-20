import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../../api/authApi";

const EmailVerificationPage = () => {
  const dispatch = useDispatch();
  const { token } = useParams();
  const navigate = useNavigate();

  // Update these selectors to point to the auth slice
  const loading = useSelector((state) => state.auth.loading);
  const emailVerified = useSelector((state) => state.auth.emailVerified);
  const error = useSelector((state) => state.auth.error);

  console.log("Email verified:", emailVerified);

  const handleVerify = () => {
    if (token) {
      dispatch(verifyEmail(token));
    }
  };

  // Redirect to sign-in page after successful verification
  useEffect(() => {
    if (emailVerified) {
      navigate("/signin"); // Replace "/signin" with your actual sign-in route
    }
  }, [emailVerified, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f3f3]">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 m-4">
        <h1 className="text-2xl font-bold mb-6 text-center text-[#131313]">
          Email Verification
        </h1>

        <div className="mb-6 text-center">
          {!emailVerified ? (
            <p className="text-[#8a8888] mb-6">
              Please click the button below to verify your email address and
              activate your account.
            </p>
          ) : (
            <p className="text-[#8a8888] mb-6">
              Your email has been successfully verified. You can now log in to
              your account.
            </p>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {!emailVerified && (
            <button
              onClick={handleVerify}
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
                  Verifying...
                </div>
              ) : (
                "Verify Email"
              )}
            </button>
          )}

          {emailVerified && (
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
              <span>Email verified successfully!</span>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-[#8a8888]">
            If you're having trouble verifying your email, please contact our
            support team.
          </p>
          <div className="mt-4 p-4 bg-[#ede5de] rounded-md border border-[#e2e8f0]">
            <p className="text-sm text-[#8a8888]">
              <span className="font-medium">Note:</span> This verification link
              will expire in 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
