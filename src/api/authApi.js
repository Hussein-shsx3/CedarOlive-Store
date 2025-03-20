import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/users`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to handle API POST requests
const apiPost = async (url, data, token = null) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await apiClient.post(url, data, { headers });
  return response.data;
};

// Helper function to extract error messages
const extractErrorMessage = (error, defaultMsg) => {
  return error.response?.data?.message || error.message || defaultMsg;
};

// Sign up a new user
export const signUp = createAsyncThunk(
  "auth/signUp",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiPost("/signup", userData);
      return response;
    } catch (error) {
      const message = extractErrorMessage(error, "Sign-up failed");
      return rejectWithValue({ message });
    }
  }
);

// Sign in an existing user
export const signIn = createAsyncThunk(
  "auth/signIn",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiPost("/login", userData);
      return response;
    } catch (error) {
      const message = extractErrorMessage(error, "Sign-in failed");
      return rejectWithValue({ message });
    }
  }
);

// Verify user email
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/verify/${token}`);
      return response.data;
    } catch (error) {
      const message = extractErrorMessage(error, "Email verification failed");
      return rejectWithValue({ message });
    }
  }
);

// Resend verification email
export const resendVerification = createAsyncThunk(
  "auth/resendVerification",
  async (email, { rejectWithValue }) => {
    try {
      const response = await apiPost("/resendVerify", { email });
      return response;
    } catch (error) {
      const message = extractErrorMessage(error, "Resend verification failed");
      return rejectWithValue({ message });
    }
  }
);

// Forgot password request
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await apiPost("/forgotPassword", { email });
      return response;
    } catch (error) {
      const message = extractErrorMessage(
        error,
        "Forgot password request failed"
      );
      return rejectWithValue({ message });
    }
  }
);

// Reset user password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password, passwordConfirm }, { rejectWithValue }) => {
    try {
      const response = await apiPost(`/resetPassword/${token}`, {
        password,
        passwordConfirm,
      });
      return response;
    } catch (error) {
      const message = extractErrorMessage(error, "Reset password failed");
      return rejectWithValue({ message });
    }
  }
);
