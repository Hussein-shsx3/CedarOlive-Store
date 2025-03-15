import { createSlice } from "@reduxjs/toolkit";

// Function to calculate total price
const calculateTotal = (cartItems) => {
  return cartItems.reduce(
    (total, item) =>
      total + item.quantity * parseFloat(String(item.price).replace("$", "")),
    0
  );
};

// Load cart from localStorage
const loadCartFromLocalStorage = () => {
  const data = localStorage.getItem("cart");
  if (!data) return { cartItems: [], totalAmount: 0 };

  const { cartItems = [], timestamp } = JSON.parse(data);

  const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
  if (Date.now() - timestamp > oneHour) {
    localStorage.removeItem("cart");
    return { cartItems: [], totalAmount: 0 };
  }

  return { cartItems, totalAmount: calculateTotal(cartItems) };
};

// Save cart to localStorage
const saveCartToLocalStorage = (cartItems, totalAmount) => {
  const data = { cartItems, totalAmount, timestamp: Date.now() };
  localStorage.setItem("cart", JSON.stringify(data));
};

const initialState = loadCartFromLocalStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        // Update quantity if item exists
        existingItem.quantity += quantity;
      } else {
        // Add new item
        state.cartItems.push({ ...action.payload });
      }

      state.totalAmount = calculateTotal(state.cartItems);
      saveCartToLocalStorage(state.cartItems, state.totalAmount);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );
      state.totalAmount = calculateTotal(state.cartItems);
      saveCartToLocalStorage(state.cartItems, state.totalAmount);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((item) => item.id === id);

      if (item) {
        item.quantity = quantity;
      }

      state.totalAmount = calculateTotal(state.cartItems);
      saveCartToLocalStorage(state.cartItems, state.totalAmount);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
      localStorage.removeItem("cart");
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
