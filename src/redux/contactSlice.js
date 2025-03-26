import { createSlice } from "@reduxjs/toolkit";
import { sendContactMessage } from "../api/contact/contactApi";

// Updated Contact Slice
const contactSlice = createSlice({
  name: "contact",
  initialState: {
    isSubmitting: false,
    isSuccess: false,
    error: null,
    message: null,
  },
  reducers: {
    resetContactForm: (state) => {
      state.isSubmitting = false;
      state.isSuccess = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendContactMessage.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.isSuccess = false;
      })
      .addCase(sendContactMessage.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(sendContactMessage.rejected, (state, action) => {
        state.isSubmitting = false;
        state.isSuccess = false;
        state.error = action.payload;
      });
  },
});

export const { resetContactForm } = contactSlice.actions;
export default contactSlice.reducer;
