import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage by default
import expireReducer from "redux-persist-expire";

// Import your reducers
import cartSlice from "./redux/cartSlice";
import authSlice from "./redux/authSlice";
import userSlice from "./redux/userSlice";
import contactSlice from "./redux/contactSlice";
import productSlice from "./redux/productSlice";
import reviewSlice from "./redux/reviewSlice";
import orderSlice from "./redux/orderSlice";
import wishlistSlice from "./redux/wishlistSlice";

// User slice persist configuration with expiration
const userPersistConfig = {
  key: "user",
  storage,
  transforms: [
    expireReducer("user", {
      expireSeconds: 86400, // 24 hours
      expiredState: {
        currentUser: null,
        allUsers: [],
        userById: null,
        status: "idle",
        error: null,
        lastUpdated: null,
      },
      autoExpire: true,
      key: "userExpire",
    }),
  ],
};

// Cart slice persist configuration with expiration
const cartPersistConfig = {
  key: "cart",
  storage,
  transforms: [
    expireReducer("cart", {
      expireSeconds: 86400, // 24 hours (1 day) in seconds
      expiredState: {}, // Replace with your cart's initial state
      autoExpire: true,
      key: "cartExpire", // unique key for this expire transform
    }),
  ],
};

// Create persisted reducers for specific slices
const persistedUserReducer = persistReducer(userPersistConfig, userSlice);
const persistedCartReducer = persistReducer(cartPersistConfig, cartSlice);

// Combine all reducers
const rootReducer = combineReducers({
  cart: persistedCartReducer,
  user: persistedUserReducer,
  auth: authSlice,
  contact: contactSlice,
  product: productSlice,
  review: reviewSlice,
  payment: orderSlice,
  wishlist: wishlistSlice,
});

// Create the store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types as they might contain non-serializable values
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        // Ignore these field paths in the state
        ignoredPaths: ["register.user", "login.user"],
      },
    }),
});

// Create the persistor
export const persistor = persistStore(store);
