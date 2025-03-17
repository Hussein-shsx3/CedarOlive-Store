import { createSlice } from "@reduxjs/toolkit";
import { signUp, signIn } from "../api/authApi";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Logout action: clears user data and removes the token cookie
    logout(state) {
      state.user = null;
      state.token = null;
      cookies.remove("token", { path: "/" });
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign-up cases
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        const { token, user } = action.payload;
        state.user = user;
        state.token = token;
        // Store token in cookies with a 1-hour expiration
        cookies.set("token", token, {
          path: "/",
          expires: new Date(Date.now() + 3600 * 1000),
        });
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Sign-up failed";
      })

      // Sign-in cases
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        const { token, user } = action.payload;
        state.user = user;
        state.token = token;
        // Set token cookie with the same expiration approach
        cookies.set("token", token, {
          path: "/",
          expires: new Date(Date.now() + 3600 * 1000),
        });
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Sign-in failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
