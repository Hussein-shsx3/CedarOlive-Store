import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../api/authApi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { loading, forgotPasswordSuccess, error } = useSelector(
    (state) => state.auth
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      dispatch(forgotPassword({ email }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="p-8 rounded-lg shadow-lg w-full max-w-md transition-all duration-300 bg-white">
        <h2
          className="text-2xl font-bold text-center mb-6"
          style={{ color: "var(--color-title, #131313)" }}
        >
          Forgot Password
        </h2>

        {forgotPasswordSuccess ? (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "var(--color-secondary, #a87048)" }}
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <p
              className="text-lg font-medium"
              style={{ color: "var(--color-secondary, #a87048)" }}
            >
              Reset link sent!
            </p>
            <p className="mt-2" style={{ color: "var(--color-text, #8a8888)" }}>
              Please check your email for instructions to reset your password.
            </p>
          </div>
        ) : (
          <>
            <p
              className="mb-6 text-center"
              style={{ color: "var(--color-text, #8a8888)" }}
            >
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 font-medium"
                  style={{ color: "var(--color-title, #131313)" }}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    color: "var(--color-title, #131313)",
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    borderColor: "var(--color-border, #e2e8f0)",
                    borderWidth: "1px",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                    "--tw-ring-color": "var(--color-secondary, #a87048)",
                  }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading || isSubmitting}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg font-medium text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{
                  backgroundColor: "var(--color-secondary, #a87048)",
                  "--tw-ring-color": "var(--color-secondary, #a87048)",
                }}
                disabled={loading || isSubmitting}
              >
                {loading || isSubmitting ? (
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
                    Sending...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              {error && (
                <div
                  className="p-3 rounded-lg text-center mt-4"
                  style={{
                    backgroundColor: "rgba(254, 226, 226, 0.5)",
                    color: "#ef4444",
                  }}
                >
                  {error}
                </div>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
