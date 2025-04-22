import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";

const cookies = new Cookies();

// Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Attach token to requests
api.interceptors.request.use(
  (config) => {
    const token = cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Response Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/* ------------------ React Query Fetchers (for v5) ------------------ */

// getAllOrders - fetches all orders
export const getAllOrders = async () => {
  const { data } = await api.get("/api/v1/orders");
  return data.data;
};

// getOrder - fetches one order
export const getOrder = async ({ queryKey }) => {
  const [_, orderId] = queryKey;
  if (!orderId) return null;
  const { data } = await api.get(`/api/v1/orders/${orderId}`);
  return data;
};

/* ------------------ Redux Toolkit Async Thunks ------------------ */

// createCheckoutSession - creates a checkout session
export const createCheckoutSession = createAsyncThunk(
  "orders/createCheckoutSession",
  async (cartData, { rejectWithValue }) => {
    try {
      console.log("Creating checkout session with data:", cartData);
      const { data } = await api.post(
        "/api/v1/orders/checkout-session",
        cartData
      );
      console.log("Checkout session created:", data);
      return data;
    } catch (error) {
      console.error(
        "Checkout session error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          "Checkout session failed"
      );
    }
  }
);

// updateOrder - updates an order
export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async ({ orderId, updateData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/v1/orders/${orderId}`, updateData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to update order"
      );
    }
  }
);

// deleteOrder - deletes an order
export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/api/v1/orders/${orderId}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to delete order"
      );
    }
  }
);
