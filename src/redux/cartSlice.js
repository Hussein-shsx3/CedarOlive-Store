import { createSlice } from "@reduxjs/toolkit";

const calculateTotal = (cartItems) => {
  return cartItems.reduce(
    (total, item) =>
      total + item.quantity * parseFloat(String(item.price).replace("$", "")),
    0
  );
};

const loadCartFromLocalStorage = () => {
  const data = localStorage.getItem("cart");
  if (!data) return { cartItems: [], totalAmount: 0 };

  const { cartItems = [], timestamp } = JSON.parse(data);

  const oneHour = 60 * 60 * 1000; 
  if (Date.now() - timestamp > oneHour) {
    localStorage.removeItem("cart");
    return { cartItems: [], totalAmount: 0 };
  }

  return { cartItems, totalAmount: calculateTotal(cartItems) };
};

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
        existingItem.quantity += quantity;
      } else {
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
