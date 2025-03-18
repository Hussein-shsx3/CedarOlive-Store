import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Create axios instance
const apiClient = axios.create({
  baseURL: "https://your-api-url.com/api/auth", // Update the API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to make a POST request
const apiPost = async (url, data, token = null) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await apiClient.post(url, data, { headers });
  return response.data;
};

// Async functions for signUp, signIn, verifyUserEmail, and resendVerification
const signUpUser = (userData) => apiPost("/signup", userData);
const signInUser = (userData) => apiPost("/signin", userData);
const verifyUserEmail = (token) => apiPost("/verify", {}, token);
const resendVerificationEmail = (email) =>
  apiPost("/resend-verification", { email });

// Function to extract error message
const extractErrorMessage = (error, defaultMsg) => {
  return error.response?.data?.message || error.message || defaultMsg;
};

// Thunks for signUp, signIn, verifyEmail, and resendVerification
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

// New Thunk for Resending Verification Email
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
