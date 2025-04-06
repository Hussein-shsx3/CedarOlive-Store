import axios from "axios";
import Cookies from "universal-cookie";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { useQuery } from "@tanstack/react-query";

const cookies = new Cookies();

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/v1`,
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

export const useGetAllReviews = (productId) =>
  useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      if (!productId) throw new Error("Product ID is required.");
      const { data } = await api.get(`/products/${productId}/reviews`);
      return data.data;
    },
    enabled: !!productId && !!cookies.get("token"),
  });

export const useGetReviewById = (reviewId) =>
  useQuery({
    queryKey: ["review", reviewId],
    queryFn: async () => {
      if (!reviewId) throw new Error("Review ID is required.");
      const { data } = await api.get(`/reviews/${reviewId}`);
      return data.data;
    },
    enabled: !!reviewId && !!cookies.get("token"),
  });

export const createReview = createAsyncThunk(
  "review/createReview",
  async ({ productId, ...reviewData }, thunkAPI) => {
    try {
      const response = await api.post(
        `/products/${productId}/reviews`,
        reviewData
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create review."
      );
    }
  }
);

export const updateReview = createAsyncThunk(
  "review/updateReview",
  async ({ reviewId, ...updatedData }, thunkAPI) => {
    try {
      const response = await api.patch(`/reviews/${reviewId}`, updatedData);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update review."
      );
    }
  }
);

//
// ---------- DELETE (Redux Toolkit)
//

/**
 * Delete a review by ID
 */
export const deleteReview = createAsyncThunk(
  "review/deleteReview",
  async (reviewId, thunkAPI) => {
    try {
      const response = await api.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete review."
      );
    }
  }
);
