import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL:  `${process.env.REACT_APP_API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const sendContactMessage = createAsyncThunk(
  "contact/sendMessage",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/contact", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send message"
      );
    }
  }
);