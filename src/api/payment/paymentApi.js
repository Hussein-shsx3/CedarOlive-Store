import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";

const cookies = new Cookies();

// Create a reusable Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("No token found in cookies. Request may fail.");
  }
  return config;
});

/** Create Stripe Checkout Session */
export const createCheckoutSession = createAsyncThunk(
  "payment/createCheckoutSession",
  async (cartData, { rejectWithValue }) => {
    try {
      console.log("Initiating Payment Request...");
      const token = cookies.get("token");
      if (!token) {
        console.error("No token found. Authorization will fail.");
        return rejectWithValue("No token found. Please log in.");
      }

      const response = await api.post(
        "/api/payment/create-checkout-session",
        cartData
      );

      console.log("Payment Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Payment Error:", error.response?.data || "Unknown Error");
      // Return a meaningful error message
      return rejectWithValue(error.response?.data || "Payment request failed.");
    }
  }
);

/** Verify Payment Status */
export const verifyPaymentStatus = createAsyncThunk(
  "payment/verifyPaymentStatus",
  async (sessionId, { rejectWithValue }) => {
    try {
      console.log("Verifying payment status for session:", sessionId);
      const response = await api.get(
        `/api/payment/verify-payment?session_id=${sessionId}`
      );
      console.log("Payment Verification Response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Payment Verification Error:",
        error.response?.data || "Unknown Error"
      );
      return rejectWithValue(
        error.response?.data || "Payment verification failed."
      );
    }
  }
);

/** Get Payment History */
export const getPaymentHistory = createAsyncThunk(
  "payment/getPaymentHistory",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching payment history...");
      const response = await api.get("/api/payment/history");
      console.log("Payment History Response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Payment History Error:",
        error.response?.data || "Unknown Error"
      );
      return rejectWithValue(
        error.response?.data || "Failed to fetch payment history."
      );
    }
  }
);

// Fix for ESLint warning by creating a named const before exporting
const paymentApi = {
  createCheckoutSession,
  verifyPaymentStatus,
  getPaymentHistory,
};

export default paymentApi;
