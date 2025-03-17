import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const apiClient = axios.create({
  baseURL: "https://your-api-url.com/api/auth", 
  headers: {
    "Content-Type": "application/json",
  },
});

const signUpUser = async (userData) => {
  const response = await apiClient.post("/signup", userData);
  return response.data;
};

const signInUser = async (userData) => {
  const response = await apiClient.post("/signin", userData);
  return response.data;
};

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
