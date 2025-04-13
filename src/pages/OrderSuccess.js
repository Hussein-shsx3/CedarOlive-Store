import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/cartSlice";
import { Link } from "react-router-dom";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";

const OrderSuccess = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear the cart on successful order
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div className="flex flex-col justify-center items-center">
      <Header />
      <div className="container mx-auto px-4 py-14 min-h-[60vh]">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <svg
              className="mx-auto h-16 w-16 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h2 className="text-2xl font-semibold mt-4 mb-2">
              Order Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been received.
            </p>

            <p className="text-gray-500 mb-4">
              A confirmation email has been sent to your email address.
            </p>

            <div className="flex justify-center space-x-4">
              <Link
                to="/profile/orders"
                className="bg-secondary text-white py-2 px-6 hover:bg-[#aa7b5a] transition duration-200"
              >
                View Your Orders
              </Link>
              <Link
                to="/shop/all"
                className="border border-gray-300 py-2 px-6 hover:bg-gray-50 transition duration-200"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
