import { createSlice } from "@reduxjs/toolkit";
import {
  signUp,
  signIn,
  verifyEmail,
  resendVerification,
} from "../api/authApi";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const initialState = {
  user: null,
  token: cookies.get("token") || null,
  loading: false,
  error: null,
  emailVerified: false,
  resendSuccess: false, // Track resend verification success status
  resendError: null, // Track any error during resend verification
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
        state.resendSuccess = true; // Mark as successful resend
        state.resendError = null; // Clear any previous errors
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.loading = false;
        state.resendSuccess = false; // Mark resend as failed
        state.resendError =
          action.payload?.message || "Resend verification failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
