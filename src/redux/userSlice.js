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
};

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateMe.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateMe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = action.payload;
      })
      .addCase(updateMe.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updatePassword.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteMe.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteMe.fulfilled, (state) => {
        state.status = "succeeded";
        state.currentUser = null; // User is deleted
      })
      .addCase(deleteMe.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allUsers.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateUserById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allUsers = state.allUsers.map((user) =>
          user.id === action.payload.id ? action.payload : user
        );
      })
      .addCase(updateUserById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteUserById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUserById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allUsers = state.allUsers.filter(
          (user) => user.id !== action.meta.arg
        );
      })
      .addCase(deleteUserById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setCurrentUser, setAllUsers, setUserById } = userSlice.actions;

export default userSlice.reducer;
