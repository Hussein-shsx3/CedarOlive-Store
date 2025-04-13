import { createSlice } from "@reduxjs/toolkit";
import {
  createCheckoutSession,
  verifyPaymentStatus,
  getPaymentHistory,
} from "../api/payment/paymentApi";

const initialState = {
  checkoutUrl: null,
  checkoutLoading: false,
  checkoutError: null,
  paymentStatus: null,
  paymentVerificationLoading: false,
  paymentVerificationError: null,
  orderDetails: null,
  paymentHistory: [],
  historyLoading: false,
  historyError: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPaymentState: (state) => {
      return initialState;
    },
    clearPaymentErrors: (state) => {
      state.checkoutError = null;
      state.paymentVerificationError = null;
      state.historyError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create checkout session
      .addCase(createCheckoutSession.pending, (state) => {
        state.checkoutLoading = true;
        state.checkoutError = null;
      })
      .addCase(createCheckoutSession.fulfilled, (state, action) => {
        state.checkoutLoading = false;
        state.checkoutUrl = action.payload.url;
      })
      .addCase(createCheckoutSession.rejected, (state, action) => {
        state.checkoutLoading = false;
        state.checkoutError =
          action.payload || "Failed to create checkout session";
      })

      // Verify payment status
      .addCase(verifyPaymentStatus.pending, (state) => {
        state.paymentVerificationLoading = true;
        state.paymentVerificationError = null;
      })
      .addCase(verifyPaymentStatus.fulfilled, (state, action) => {
        state.paymentVerificationLoading = false;
        state.paymentStatus = action.payload.paymentStatus;
        state.orderDetails = action.payload;
      })
      .addCase(verifyPaymentStatus.rejected, (state, action) => {
        state.paymentVerificationLoading = false;
        state.paymentVerificationError =
          action.payload || "Failed to verify payment";
      })

      // Get payment history
      .addCase(getPaymentHistory.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(getPaymentHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.paymentHistory = action.payload;
      })
      .addCase(getPaymentHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError =
          action.payload || "Failed to fetch payment history";
      });
  },
});

export const { resetPaymentState, clearPaymentErrors } = paymentSlice.actions;
export default paymentSlice.reducer;
