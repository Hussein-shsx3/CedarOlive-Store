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

export const useGetCurrentUser = () =>
  useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data } = await api.get("/me");
      return data.data;
    },
    enabled: !!cookies.get("token"),
    staleTime: 5 * 60 * 1000, 
  });

export const useGetAllUsers = () =>
  useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const { data } = await api.get("/");
      return data.data;
    },
    enabled: !!cookies.get("token"),
  });

export const useGetUserById = (userId) =>
  useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required.");
      const response = await api.get(`/${userId}`);
      return response.data.data;
    },
    enabled: !!userId && !!cookies.get("token"),
  });

export const updateMe = createAsyncThunk(
  "user/updateMe",
  async (formData, thunkAPI) => {
    try {
      const response = await api.patch("/updateMe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Update failed"
      );
    }
  }
);

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (passwordData, thunkAPI) => {
    const token = cookies.get("token");
    if (!token) {
      return thunkAPI.rejectWithValue("Authentication token is missing.");
    }
    try {
      const response = await api.patch("/updateMyPassword", passwordData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Password update failed."
      );
    }
  }
);

export const deleteMe = createAsyncThunk(
  "user/deleteMe",
  async (_, thunkAPI) => {
    const token = cookies.get("token");
    if (!token) {
      return thunkAPI.rejectWithValue("Authentication token is missing.");
    }
    try {
      const response = await api.delete("/deleteMe");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "User deletion failed."
      );
    }
  }
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async (userData, thunkAPI) => {
    const token = cookies.get("token");
    if (!token) {
      return thunkAPI.rejectWithValue("Authentication token is missing.");
    }
    try {
      const response = await api.post("/", userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "User creation failed."
      );
    }
  }
);

export const updateUserById = createAsyncThunk(
  "user/updateUserById",
  async ({ userId, userData }, thunkAPI) => {
    const token = cookies.get("token");
    if (!token) {
      return thunkAPI.rejectWithValue("Authentication token is missing.");
    }
    try {
      const response = await api.patch(`/${userId}`, userData);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "User update failed."
      );
    }
  }
);

export const deleteUserById = createAsyncThunk(
  "user/deleteUserById",
  async (userId, thunkAPI) => {
    const token = cookies.get("token");
    if (!token) {
      return thunkAPI.rejectWithValue("Authentication token is missing.");
    }
    try {
      const response = await api.delete(`/${userId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "User deletion failed."
      );
    }
  }
);
