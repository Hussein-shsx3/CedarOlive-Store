import { createSlice } from "@reduxjs/toolkit";
import {
  signUp,
  signIn,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
} from "../api/auth/authApi";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const initialState = {
  user: null, // Logged-in user data
  token: cookies.get("token") || null, // JWT token from cookies
  loading: false, // Loading state for async operations
  error: null, // Error message for failed operations
  emailVerified: false, // Whether the user's email is verified
  resendSuccess: false, // Whether resend verification email was successful
  resendError: null, // Error message for resend verification
  forgotPasswordSuccess: false, // Whether forgot password request was successful
  resetPasswordSuccess: false, // Whether password reset was successful
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      cookies.remove("token", { path: "/" });
      state.emailVerified = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign-up cases
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        const { user } = action.payload;
        state.user = user;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Sign-up failed";
        console.error("Sign-up error:", action.payload);
      })

      // Sign-in cases
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        const { token, user } = action.payload;
        state.user = user;
        state.token = token;
        cookies.set("token", token, {
          path: "/",
          expires: new Date(Date.now() + 3600 * 1000), // 1 hour
        });
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Sign-in failed";
        console.error("Sign-in error:", action.payload);
      })

      // Email verification cases
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        state.emailVerified = true;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.emailVerified = false;
        state.error = action.payload?.message || "Email verification failed";
        console.error("Email verification error:", action.payload);
      })

      // Resend verification cases
      .addCase(resendVerification.pending, (state) => {
        state.loading = true;
        state.resendError = null;
      })
      .addCase(resendVerification.fulfilled, (state) => {
        state.loading = false;
        state.resendSuccess = true;
        state.resendError = null;
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.loading = false;
        state.resendSuccess = false;
        state.resendError =
          action.payload?.message || "Resend verification failed";
        console.error("Resend verification error:", action.payload);
      })

      // Forgot Password cases
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.forgotPasswordSuccess = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.forgotPasswordSuccess = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.forgotPasswordSuccess = false;
        state.error =
          action.payload?.message || "Forgot password request failed";
        console.error("Forgot password error:", action.payload);
      })

      // Reset Password cases
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.resetPasswordSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.resetPasswordSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.resetPasswordSuccess = false;
        state.error = action.payload?.message || "Reset password failed";
        console.error("Reset password error:", action.payload);
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
