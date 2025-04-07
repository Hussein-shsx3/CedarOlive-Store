import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage by default

import cartSlice from "./redux/cartSlice";
import authSlice from "./redux/authSlice";
import userSlice from "./redux/userSlice";
import contactSlice from "./redux/contactSlice";
import productSlice from "./redux/productSlice";
import reviewSlice from "./redux/reviewSlice";

// Combine all your reducers
const rootReducer = combineReducers({
  cart: cartSlice,
  auth: authSlice,
  user: userSlice,
  contact: contactSlice,
  product: productSlice,
  review: reviewSlice,
});

// Persist Configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "cart"],
};

// Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

// Create the persistor
export const persistor = persistStore(store);
