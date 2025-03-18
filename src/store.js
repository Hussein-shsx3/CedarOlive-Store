import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./redux/cartSlice";
import authSlice from "./redux/authSlice";

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    auth: authSlice,
  },
});
