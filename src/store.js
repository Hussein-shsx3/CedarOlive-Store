import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./redux/cartSlice";
import authSlice from "./redux/authSlice";
import userSlice from "./redux/userSlice";
import contactSlice from "./redux/contactSlice";
import productSlice from "./redux/productSlice";
import reviewSlice from "./redux/reviewSlice";

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    auth: authSlice,
    user: userSlice,
    contact: contactSlice,
    product: productSlice,
    review: reviewSlice,
  },
});
