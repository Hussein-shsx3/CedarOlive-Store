import { createSlice } from "@reduxjs/toolkit";
import {
  sendContactMessage,
  updateContactMessage,
  deleteContactMessage,
} from "../api/contact/contactApi";

const initialState = {
  contacts: [],
  contact: null,
  isLoading: false,
  isSubmitting: false,
  isSuccess: false,
  error: null,
  message: null,
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    resetContactForm: (state) => {
      state.isSuccess = false;
      state.error = null;
      state.message = null;
    },
    setContact: (state, action) => {
      state.contact = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send contact message cases
      .addCase(sendContactMessage.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(sendContactMessage.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.isSuccess = true;
        state.message = "Message sent successfully!";
        state.contacts.push(action.payload);
      })
      .addCase(sendContactMessage.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload || "Failed to send message";
      })

      // Update contact message cases
      .addCase(updateContactMessage.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateContactMessage.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.isSuccess = true;
        state.message = "Contact status updated successfully!";
        state.contacts = state.contacts.map((contact) =>
          contact._id === action.payload._id ? action.payload : contact
        );
      })
      .addCase(updateContactMessage.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload || "Failed to update contact";
      })

      // Delete contact message cases
      .addCase(deleteContactMessage.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(deleteContactMessage.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.isSuccess = true;
        state.message = "Contact deleted successfully!";
        state.contacts = state.contacts.filter(
          (contact) => contact._id !== action.payload
        );
      })
      .addCase(deleteContactMessage.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload || "Failed to delete contact";
      });
  },
});

export const { resetContactForm, setContact } = contactSlice.actions;
export default contactSlice.reducer;
