import axios from "axios";
import Cookies from "universal-cookie";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { useQuery } from "@tanstack/react-query";

const cookies = new Cookies();

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/v1/users`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// React Query hook for getting current user's wishlist
export const useGetMyWishlist = () =>
  useQuery({
    queryKey: ["myWishlist"],
    queryFn: async () => {
      const { data } = await api.get("/me/wishlist");
      return data.data;
    },
    enabled: !!cookies.get("token"),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

// Redux Toolkit async thunk for adding an item to wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, thunkAPI) => {
    const token = cookies.get("token");
    if (!token) {
      return thunkAPI.rejectWithValue("Authentication token is missing.");
    }
    try {
      const response = await api.post("/me/wishlist", { productId });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add item to wishlist."
      );
    }
  }
);

// Redux Toolkit async thunk for removing an item from wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, thunkAPI) => {
    const token = cookies.get("token");
    if (!token) {
      return thunkAPI.rejectWithValue("Authentication token is missing.");
    }
    try {
      const response = await api.delete(`/me/wishlist/${productId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to remove item from wishlist."
      );
    }
  }
);

// Optional: Check if product is in wishlist
export const useCheckProductInWishlist = (productId) =>
  useQuery({
    queryKey: ["wishlistCheck", productId],
    queryFn: async () => {
      if (!productId) return false;
      try {
        const { data } = await api.get("/me/wishlist");
        return data.data.some(
          (item) => item._id === productId || item.product?._id === productId
        );
      } catch (error) {
        return false;
      }
    },
    enabled: !!productId && !!cookies.get("token"),
  });
