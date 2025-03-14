import { createSlice } from "@reduxjs/toolkit";

const loadCartFromLocalStorage = () => {
  const data = localStorage.getItem("cart");
  if (!data) return { cartItems: [], totalAmount: 0 };

  const { cartItems = [], timestamp } = JSON.parse(data); // Default to empty array if cartItems is undefined

  const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
  if (Date.now() - timestamp > oneHour) {
    localStorage.removeItem("cart");
    return { cartItems: [], totalAmount: 0 };
  }

  return { cartItems, totalAmount: calculateTotal(cartItems) };
};

// Function to calculate total price
const calculateTotal = (cartItems) => {
  return cartItems.reduce(
    (total, item) => total + parseFloat(item.price.replace("$", "")),
    0
  );
};

// Save cart to localStorage
const saveCartToLocalStorage = (cartItems) => {
  const data = { cartItems, timestamp: Date.now() };
  localStorage.setItem("cart", JSON.stringify(data));
};

const initialState = loadCartFromLocalStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.cartItems.push(action.payload);
      state.totalAmount = calculateTotal(state.cartItems);
      saveCartToLocalStorage(state.cartItems);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );
      state.totalAmount = calculateTotal(state.cartItems);
      saveCartToLocalStorage(state.cartItems);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
      localStorage.removeItem("cart");
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
