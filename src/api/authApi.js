import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/users`,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiPost = async (url, data, token = null) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await apiClient.post(url, data, { headers });
  return response.data;
};

const signUpUser = (userData) => apiPost("/signup", userData);
const signInUser = (userData) => apiPost("/login", userData);
const verifyUserEmail = (token) => apiPost(`/verify/${token}`);
const resendVerificationEmail = (email) => apiPost("/resendVerify", { email });

const forgotPasswordRequest = (email) => apiPost("/forgotPassword", { email });

const resetUserPassword = (token, newPassword) =>
  apiPost(`/resetPassword/${token}`, { newPassword });

const extractErrorMessage = (error, defaultMsg) => {
  return error.response?.data?.message || error.message || defaultMsg;
};

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (userData, { rejectWithValue }) => {
    try {
      return await signUpUser(userData);
    } catch (error) {
      const message = extractErrorMessage(error, "Sign-up failed");
      return rejectWithValue({ message });
    }
  }
);

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (userData, { rejectWithValue }) => {
    try {
      return await signInUser(userData);
    } catch (error) {
      const message = extractErrorMessage(error, "Sign-in failed");
      return rejectWithValue({ message });
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token, { rejectWithValue }) => {
    try {
      return await verifyUserEmail(token);
    } catch (error) {
      const message = extractErrorMessage(error, "Email verification failed");
      return rejectWithValue({ message });
    }
  }
);

export const resendVerification = createAsyncThunk(
  "auth/resendVerification",
  async (email, { rejectWithValue }) => {
    try {
      return await resendVerificationEmail(email);
    } catch (error) {
      const message = extractErrorMessage(error, "Resend verification failed");
      return rejectWithValue({ message });
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      return await forgotPasswordRequest(email);
    } catch (error) {
      const message = extractErrorMessage(
        error,
        "Forgot password request failed"
      );
      return rejectWithValue({ message });
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      return await resetUserPassword(token, newPassword);
    } catch (error) {
      const message = extractErrorMessage(error, "Reset password failed");
      return rejectWithValue({ message });
    }
  }
);
