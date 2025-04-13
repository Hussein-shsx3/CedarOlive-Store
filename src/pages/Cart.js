import React, { useEffect } from "react";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromCart, updateQuantity, clearCart } from "../redux/cartSlice";
import { createCheckoutSession } from "../api/payment/paymentApi";
import { clearPaymentErrors } from "../redux/paymentSlice";

const Cart = () => {
  const { cartItems, totalAmount } = useSelector((state) => state.cart);
  const { currentUser } = useSelector((state) => state.user);
  const { checkoutLoading, checkoutError, checkoutUrl } = useSelector(
    (state) => state.payment
  );
  const dispatch = useDispatch();

  // Handle quantity change
  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };

  // Handle remove item
  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  // Handle clear cart
  const handleClearCart = () => {
    dispatch(clearCart());
  };

  // Handle checkout with Stripe
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    // Clear any previous errors
    dispatch(clearPaymentErrors());

    // Prepare line items for Stripe
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: parseFloat(String(item.price).replace("$", "")) * 100, // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create checkout data
    const checkoutData = {
      lineItems,
      customer_email: currentUser?.email,
      success_url: `${window.location.origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${window.location.origin}/cart`,
    };

    // Use the createCheckoutSession thunk
    dispatch(createCheckoutSession(checkoutData));
  };

  // Redirect to Stripe when checkout URL is available
  useEffect(() => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  }, [checkoutUrl]);

  // Clear error message after 5 seconds
  useEffect(() => {
    if (checkoutError) {
      const timer = setTimeout(() => {
        dispatch(clearPaymentErrors());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [checkoutError, dispatch]);

  return (
    <div className="flex flex-col justify-center items-center">
      <Header />
      <div className="container mx-auto px-4 py-14">
        <h1 className="text-3xl font-semibold mb-6">Shopping Cart</h1>

        {checkoutError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <span>{checkoutError}</span>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl text-gray-500 mb-4">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">
              Add items to your cart to see them here
            </p>
            <Link
              to="/shop/all"
              className="bg-secondary text-white py-3 px-6 hover:bg-[#aa7b5a] transition duration-200"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cartItems.map((item) => {
                      const itemPrice = parseFloat(
                        String(item.price).replace("$", "")
                      );
                      const itemTotal = itemPrice * item.quantity;

                      return (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-20 w-20 flex-shrink-0">
                                <img
                                  className="h-20 w-20 object-cover"
                                  src={item.image || "/api/placeholder/80/80"}
                                  alt={item.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {item.name}
                                </div>
                                {item.color && (
                                  <div className="text-sm text-gray-500">
                                    Color: {item.color}
                                  </div>
                                )}
                                {item.size && (
                                  <div className="text-sm text-gray-500">
                                    Size: {item.size}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {item.price}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center border rounded w-28">
                              <button
                                className="px-3 py-1 text-gray-600 hover:text-gray-800"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1}
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    item.id,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className="w-10 text-center border-0 focus:ring-0"
                              />
                              <button
                                className="px-3 py-1 text-gray-600 hover:text-gray-800"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${itemTotal.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-between">
                <Link to="/shop/all" className="text-secondary hover:underline">
                  Continue Shopping
                </Link>
                <button
                  onClick={handleClearCart}
                  className="text-red-600 hover:text-red-800"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Subtotal (
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                      items)
                    </span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading || cartItems.length === 0}
                  className="w-full bg-secondary text-white py-3 px-6 hover:bg-[#aa7b5a] transition duration-200 mb-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {checkoutLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
