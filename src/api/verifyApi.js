import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://your-api-url.com/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

const verifyUserEmail = async (userId) => {
  const response = await apiClient.post(`/verify/${userId}`);
  return response.data;
};

const extractErrorMessage = (error, defaultMsg) => {
  return error.response?.data?.message || error.message || defaultMsg;
};

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (userId, { rejectWithValue }) => {
    if (!userId) {
      return rejectWithValue({ message: "User ID is required" });
    }

    try {
      const data = await verifyUserEmail(userId);
      return data;
    } catch (error) {
      console.error("Email verification error:", error);
      const message = extractErrorMessage(
        error,
        "Email verification failed. Please try again."
      );
      return rejectWithValue({ message });
    }
  }
);
