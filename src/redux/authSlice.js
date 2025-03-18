import { createSlice } from "@reduxjs/toolkit";
import {
  signUp,
  signIn,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
} from "../api/authApi";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const initialState = {
  user: null,
  token: cookies.get("token") || null,
  loading: false,
  error: null,
  emailVerified: false,
  resendSuccess: false, 
  resendError: null, 
  forgotPasswordSuccess: false, 
  resetPasswordSuccess: false, 
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
        state.token = null;
        cookies.remove("token", { path: "/" });
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Sign-up failed";
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
          expires: new Date(Date.now() + 3600 * 1000),
        });
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Sign-in failed";
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
      })

      // ✅ Forgot Password cases
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
      })

      // ✅ Reset Password cases
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
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
