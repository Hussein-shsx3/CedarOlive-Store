import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./redux/cartSlice";

export const store = configureStore({
  reducer: {
    cart: cartSlice,
  },
});
