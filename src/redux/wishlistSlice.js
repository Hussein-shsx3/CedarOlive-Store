import { createSlice } from "@reduxjs/toolkit";
import { addToWishlist, removeFromWishlist } from "../api/wishlist/wishlistApi";

const initialState = {
  items: [],
  loading: false,
  error: null,
  lastAddedItem: null,
  lastRemovedItem: null,
  addSuccess: false,
  removeSuccess: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    resetWishlistStatus: (state) => {
      state.error = null;
      state.addSuccess = false;
      state.removeSuccess = false;
      state.lastAddedItem = null;
      state.lastRemovedItem = null;
    },
    setWishlistItems: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add to wishlist
    builder
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.addSuccess = false;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.addSuccess = true;
        state.lastAddedItem = action.payload.data;

        // Optionally update local items array if the response includes the updated wishlist
        if (
          action.payload.data &&
          Array.isArray(action.payload.data.wishlist)
        ) {
          state.items = action.payload.data.wishlist;
        } else if (action.payload.data) {
          // If we only get the added item back, we can push it to our items array
          state.items.push(action.payload.data);
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.addSuccess = false;
      });

    // Remove from wishlist
    builder
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.removeSuccess = false;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.removeSuccess = true;
        state.lastRemovedItem = action.meta.arg; // Store the ID that was removed

        // Update local items array by filtering out the removed item
        if (action.meta.arg) {
          state.items = state.items.filter((item) => {
            // Handle both cases where item might be the full object or just contain product
            const itemId = item._id || item.product?._id;
            return itemId !== action.meta.arg;
          });
        }
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.removeSuccess = false;
      });
  },
});

export const { resetWishlistStatus, setWishlistItems } = wishlistSlice.actions;

// Selector to get wishlist items
export const selectWishlistItems = (state) => state.wishlist.items;
// Selector to check if an item is in wishlist
export const selectIsItemInWishlist = (state, productId) =>
  state.wishlist.items.some((item) => {
    const itemId = item._id || item.product?._id;
    return itemId === productId;
  });
// Selector for loading state
export const selectWishlistLoading = (state) => state.wishlist.loading;
// Selector for error state
export const selectWishlistError = (state) => state.wishlist.error;
// Selectors for success states
export const selectAddSuccess = (state) => state.wishlist.addSuccess;
export const selectRemoveSuccess = (state) => state.wishlist.removeSuccess;

export default wishlistSlice.reducer;
