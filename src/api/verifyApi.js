import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const apiClient = axios.create({
  baseURL: "https://your-api-url.com/api/auth", 
  headers: {
    "Content-Type": "application/json",
  },
});

const verifyUserEmail = async (userId) => {
  const response = await apiClient.get(`/verify/${userId}`);
  return response.data;
};

// Helper to extract error messages
const extractErrorMessage = (error, defaultMsg) => {
  return error.response?.data?.message || error.message || defaultMsg;
};

// Create an async thunk for verifying email.
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (userId, { rejectWithValue }) => {
    try {
      return await verifyUserEmail(userId);
    } catch (error) {
      const message = extractErrorMessage(error, "Email verification failed");
      return rejectWithValue({ message });
    }
  }
);
