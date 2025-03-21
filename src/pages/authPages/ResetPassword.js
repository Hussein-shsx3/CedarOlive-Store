import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../api/auth/authApi";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const { loading, resetPasswordSuccess, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (resetPasswordSuccess) {
      const timer = setTimeout(() => navigate("/signIn"), 3000);
      return () => clearTimeout(timer);
    }
  }, [resetPasswordSuccess, navigate]);

  // Password strength checker
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (newPassword.length >= 8) strength += 1;
    if (/[A-Z]/.test(newPassword)) strength += 1;
    if (/[0-9]/.test(newPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;

    setPasswordStrength(strength);
  }, [newPassword]);

  const validatePasswords = () => {
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswords()) return;

    setIsSubmitting(true);
    try {
      dispatch(
        resetPassword({
          token,
          password: newPassword,
          passwordConfirm: confirmPassword,
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="p-8 rounded-lg shadow-lg w-full max-w-md transition-all duration-300 bg-white">
        <h2
          className="text-2xl font-bold text-center mb-6"
          style={{ color: "var(--color-title, #131313)" }}
        >
          Reset Password
        </h2>

        {resetPasswordSuccess ? (
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
              Password updated successfully!
            </p>
            <p className="mt-2" style={{ color: "var(--color-text, #8a8888)" }}>
              Redirecting to login page in a few seconds...
            </p>
          </div>
        ) : (
          <>
            <p
              className="mb-6 text-center"
              style={{ color: "var(--color-text, #8a8888)" }}
            >
              Create a new password for your account
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="newPassword"
                  className="block mb-2 font-medium"
                  style={{ color: "var(--color-title, #131313)" }}
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    color: "var(--color-title, #131313)",
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    borderColor: "var(--color-border, #e2e8f0)",
                    borderWidth: "1px",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                    "--tw-ring-color": "var(--color-secondary, #a87048)",
                  }}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={loading || isSubmitting}
                />

                {newPassword && (
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
                      <li>• At least 8 characters</li>
                      <li>• At least one uppercase letter</li>
                      <li>• At least one number</li>
                      <li>• At least one special character</li>
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 font-medium"
                  style={{ color: "var(--color-title, #131313)" }}
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    color: "var(--color-title, #131313)",
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    borderColor: "var(--color-border, #e2e8f0)",
                    borderWidth: "1px",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                    "--tw-ring-color": "var(--color-secondary, #a87048)",
                  }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading || isSubmitting}
                />
              </div>

              {(passwordError || error) && (
                <div
                  className="p-3 rounded-lg text-center"
                  style={{
                    backgroundColor: "rgba(254, 226, 226, 0.5)",
                    color: "#ef4444",
                  }}
                >
                  {passwordError || error}
                </div>
              )}

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
                    Updating...
                  </span>
                ) : (
                  "Update Password"
                )}
              </button>
              <div className="mt-4 p-4 bg-[#ede5de] rounded-md border border-[#e2e8f0]">
                <p className="text-sm text-[#8a8888]">
                  <span className="font-medium">Note:</span> This reset password
                  link will expire in 10 minu.
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
