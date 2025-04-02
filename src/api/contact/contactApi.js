import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { useQuery } from "@tanstack/react-query";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/v1/contact`,
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

export const useGetContacts = () =>
  useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const { data } = await api.get("/");
      return data.data;
    },
    enabled: !!cookies.get("token"),
  });

export const useGetContactById = (contactId) =>
  useQuery({
    queryKey: ["contact", contactId],
    queryFn: async () => {
      if (!contactId) throw new Error("Contact ID is required");
      const { data } = await api.get(`/${contactId}`);
      return data.data;
    },
    enabled: !!contactId && !!cookies.get("token"),
  });


export const sendContactMessage = createAsyncThunk(
  "contact/sendMessage",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send message"
      );
    }
  }
);

export const updateContactMessage = createAsyncThunk(
  "contact/updateMessage",
  async ({ id, contactData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/${id}`, contactData);
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update message"
      );
    }
  }
);

export const deleteContactMessage = createAsyncThunk(
  "contact/deleteMessage",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete message"
      );
    }
  }
);
