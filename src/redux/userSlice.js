import { createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // Uses localStorage by default
import { persistReducer } from "redux-persist";
import {
  updateMe,
  updatePassword,
  deleteMe,
  createUser,
  updateUserById,
  deleteUserById,
} from "../api/users/userApi";

// 1️⃣ Persist config
const persistConfig = {
  key: "user",
  storage,
  whitelist: ["currentUser"], // only persist currentUser (adjust as needed)
};

// 2️⃣ Initial state
const initialState = {
  currentUser: null,
  allUsers: [],
  userById: null,
  status: "idle",
  error: null,
};

// 3️⃣ Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
    setAllUsers(state, action) {
      state.allUsers = action.payload;
    },
    setUserById(state, action) {
      state.userById = action.payload;
    },
    resetUserStatus(state) {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUserById.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.allUsers.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.allUsers[index] = action.payload;
        }
        if (state.userById && state.userById.id === action.payload.id) {
          state.userById = action.payload;
        }
      })
      .addCase(updateUserById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "User update failed";
      })
      .addCase(updateMe.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateMe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = action.payload;
      })
      .addCase(updateMe.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Update me failed";
      })
      .addCase(updatePassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Update password failed";
      })
      .addCase(deleteMe.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteMe.fulfilled, (state) => {
        state.status = "succeeded";
        state.currentUser = null;
      })
      .addCase(deleteMe.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Delete me failed";
      })
      .addCase(createUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allUsers.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Create user failed";
      })
      .addCase(deleteUserById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteUserById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allUsers = state.allUsers.filter(
          (user) => user.id !== action.payload.id
        );
        if (state.userById && state.userById.id === action.payload.id) {
          state.userById = null;
        }
      })
      .addCase(deleteUserById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Delete user by ID failed";
      });
  },
});

// 4️⃣ Export actions
export const { setCurrentUser, setAllUsers, setUserById, resetUserStatus } =
  userSlice.actions;

// 5️⃣ Export persisted reducer
export default persistReducer(persistConfig, userSlice.reducer);
