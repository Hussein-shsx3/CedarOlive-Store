import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail } from "../api/verifyApi";
import { resetVerification } from "../redux/verifySlice";

const EmailVerificationPage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();

  // Get verification state from Redux
  const { isVerified, loading, error } = useSelector((state) => state.verify);

  useEffect(() => {
    if (userId) {
      dispatch(verifyEmail(userId));
    }

    return () => {
      dispatch(resetVerification());
    };
  }, [dispatch, userId]);

  // Render UI based on verification state
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#a87048] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#8a8888]">Verifying your email...</p>
        </div>
      );
    }

    if (isVerified) {
      return (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-[#ede5de] rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-[#a87048]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#131313] mb-2">
            Email Verified!
          </h3>
          <p className="text-[#8a8888] mb-6 text-center">
            Your email has been successfully verified. You can now access all
            features of your account.
          </p>
          <Link
            to="/login"
            className="py-2 px-6 bg-[#a87048] text-white rounded-lg hover:bg-opacity-90 transition-all"
          >
            Log In
          </Link>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-[#ede5de] rounded-full flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[#131313] mb-2">
          Verification Failed
        </h3>
        <p className="text-[#8a8888] mb-2 text-center">
          {error || "An error occurred during verification."}
        </p>
        <p className="text-[#8a8888] mb-6 text-center">
          Please try again or contact our support team for assistance.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => dispatch(verifyEmail(userId))}
            className="py-2 px-6 bg-[#ede5de] text-[#a87048] rounded-lg hover:bg-opacity-90 transition-all"
          >
            Try Again
          </button>
          <Link
            to="/contact"
            className="py-2 px-6 bg-[#a87048] text-white rounded-lg hover:bg-opacity-90 transition-all"
          >
            Contact Support
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f3f3] px-4 py-12">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#131313]">
            Email Verification
          </h2>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default EmailVerificationPage;
