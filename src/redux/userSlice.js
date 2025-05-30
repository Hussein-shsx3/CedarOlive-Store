import { createSlice } from "@reduxjs/toolkit";
import {
  updateMe,
  updatePassword,
  deleteMe,
  createUser,
  updateUserById,
  deleteUserById,
} from "../api/users/userApi";

const initialState = {
  currentUser: null,
  allUsers: [],
  userById: null,
  status: "idle",
  error: null,
  lastUpdated: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
      state.lastUpdated = Date.now();
    },
    setAllUsers(state, action) {
      state.allUsers = action.payload;
      state.lastUpdated = Date.now();
    },
    setUserById(state, action) {
      state.userById = action.payload;
      state.lastUpdated = Date.now();
    },
    resetUserState() {
      return { ...initialState, lastUpdated: null };
    },
    resetUserStatus(state) {
      state.status = "idle";
      state.error = null;
    },
    checkExpiration(state) {
      const oneDayInMillis = 24 * 60 * 60 * 1000;
      if (Date.now() - state.lastUpdated > oneDayInMillis) {
        return { ...initialState, lastUpdated: null };
      }
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

export const {
  setCurrentUser,
  setAllUsers,
  setUserById,
  resetUserStatus,
  resetUserState,
  checkExpiration,
} = userSlice.actions;

export default userSlice.reducer;
