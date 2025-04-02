import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/users`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const apiPost = async (url, data) => {
  const response = await apiClient.post(url, data);
  return response.data;
};

const apiPatch = async (url, data) => {
  const response = await apiClient.patch(url, data);
  return response.data;
};

const extractErrorMessage = (error, defaultMsg) => {
  return error.response?.data?.message || error.message || defaultMsg;
};

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

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiPost("/login", userData);
      localStorage.setItem("token", response.token); 
      return response;
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
      const response = await apiPatch(`/verify/${token}`, {});
      return response.data;
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
      const response = await apiPost("/resendVerify", { email });
      return response;
    } catch (error) {
      const message = extractErrorMessage(error, "Resend verification failed");
      return rejectWithValue({ message });
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await apiPost("/forgotPassword", { email });
      return response;
    } catch (error) {
      const message = extractErrorMessage(error, "Forgot password request failed");
      return rejectWithValue({ message });
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password, passwordConfirm }, { rejectWithValue }) => {
    try {
      const response = await apiPatch(`/resetPassword/${token}`, {
        password,
        passwordConfirm,
      });
      localStorage.setItem("token", response.token); // Store new token
      return response;
    } catch (error) {
      const message = extractErrorMessage(error, "Reset password failed");
      return rejectWithValue({ message });
    }
  }
);
