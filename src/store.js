import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./redux/cartSlice";
import authSlice from "./redux/authSlice";
import verifySlice from "./redux/verifySlice";

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    auth: authSlice,
    verify: verifySlice,
  },
});
