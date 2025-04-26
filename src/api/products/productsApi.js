import axios from "axios";
import Cookies from "universal-cookie";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { useQuery } from "@tanstack/react-query";

const cookies = new Cookies();

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/v1/products`,
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

export const useGetAllProducts = (queryParams = {}) =>
  useQuery({
    queryKey: ["products", queryParams],
    queryFn: async () => {
      const params = { ...queryParams };

      if (params.$or) {
        try {
          if (typeof params.$or === "string") {
            params.$or = encodeURIComponent(params.$or);
          } else {
            params.$or = encodeURIComponent(JSON.stringify(params.$or));
          }
        } catch (error) {
          console.error("Error processing search parameters:", error);
          delete params.$or; 
        }
      }

      const queryString =
        Object.keys(params).length > 0
          ? `?${new URLSearchParams(params).toString()}`
          : "";

      const { data } = await api.get(queryString);

      return {
        products: data.data,
        totalResults: data.total,
        currentPage: data.page,
        totalPages: data.totalPages,
        resultsPerPage: data.limit,
      };
    },
    refetchOnWindowFocus: queryParams.refetchOnWindowFocus || false,
  });
  
export const useGetProductById = (productId) =>
  useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!productId) throw new Error("Product ID is required.");
      const response = await api.get(`/${productId}`);
      return response.data.data;
    },
    enabled: !!productId,
  });

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (productData, thunkAPI) => {
    try {
      const response = await api.post("", productData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Product creation failed."
      );
    }
  }
);

export const updateProductById = createAsyncThunk(
  "product/updateProductById",
  async ({ productId, productData }, thunkAPI) => {
    try {
      const response = await api.patch(`/${productId}`, productData);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Product update failed."
      );
    }
  }
);

export const deleteProductById = createAsyncThunk(
  "product/deleteProductById",
  async (productId, thunkAPI) => {
    try {
      const response = await api.delete(`/${productId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Product deletion failed."
      );
    }
  }
);
