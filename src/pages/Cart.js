import React, { useEffect, useState } from "react";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromCart, updateQuantity, clearCart } from "../redux/cartSlice";
import { createCheckoutSession } from "../api/order/orderApi";
import { clearOrderState } from "../redux/orderSlice";

const Cart = () => {
  const { cartItems, totalAmount } = useSelector((state) => state.cart);
  const checkoutLoading = useSelector(
    (state) => state.orders?.loading || false
  );
  const checkoutError = useSelector((state) => state.orders?.error || null);
  const checkoutSession = useSelector(
    (state) => state.orders?.checkoutSession || null
  );
  const [debugInfo, setDebugInfo] = useState(null);

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

  // Enhanced checkout function with debug logging
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setDebugInfo("Cart is empty. Cannot proceed to checkout.");
      return;
    }

    // Log current state for debugging
    setDebugInfo("Preparing checkout data...");

    try {
      // Prepare products array for the backend
      const products = cartItems.map((item) => {
        // First try to get numeric price
        const price = parseFloat(String(item.price).replace("$", ""));

        return {
          id: item.id, // Make sure this ID matches your product ID in the database
          name: item.name,
          price: price, // Convert price string to float
          quantity: item.quantity,
          // Include image if available
          image: item.image || null,
        };
      });

      // Log what we're about to send
      console.log("Checkout data being sent:", { products });
      setDebugInfo(`Sending checkout data with ${products.length} products...`);

      // Create checkout data
      const checkoutData = {
        products,
      };

      // Dispatch the action
      const result = await dispatch(
        createCheckoutSession(checkoutData)
      ).unwrap();

      // Handle the result immediately to ensure redirect happens
      console.log("Checkout response:", result);

      if (result && result.url) {
        setDebugInfo(`Checkout successful! Redirecting to ${result.url}...`);
        // Add a small delay for the UI to update before redirecting
        setTimeout(() => {
          window.location.href = result.url;
        }, 100);
      } else {
        setDebugInfo("Error: Checkout session URL not found in response");
        console.error("Missing URL in checkout response:", result);
      }
    } catch (error) {
      console.error("Error in checkout process:", error);
      setDebugInfo(`Checkout error: ${error.message || JSON.stringify(error)}`);
    }
  };

  // Keep this as a backup to ensure redirection happens if state updates
  useEffect(() => {
    if (checkoutSession?.url) {
      console.log("Redirecting to:", checkoutSession.url);
      setDebugInfo(
        `Redirecting to payment page via effect: ${checkoutSession.url}`
      );
      window.location.href = checkoutSession.url;
    }
  }, [checkoutSession]);

  // Clear error message after 5 seconds
  useEffect(() => {
    if (checkoutError) {
      const timer = setTimeout(() => {
        dispatch(clearOrderState());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [checkoutError, dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 md:py-14 flex-grow">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6">
          Shopping Cart
        </h1>

        {/* Debug info panel (only visible when there's debug info) */}
        {debugInfo && (
          <div className="bg-blue-50 border border-blue-300 text-blue-800 px-4 py-3 rounded mb-4">
            <p className="font-bold">Debug Info:</p>
            <pre className="text-xs overflow-x-auto">{debugInfo}</pre>
          </div>
        )}

        {checkoutError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <span>{checkoutError}</span>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="text-center py-8 md:py-12">
            <h2 className="text-xl md:text-2xl text-gray-500 mb-3 md:mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-400 mb-4 md:mb-6">
              Add items to your cart to see them here
            </p>
            <Link
              to="/shop/all"
              className="bg-secondary text-white py-2 px-4 md:py-3 md:px-6 hover:bg-[#aa7b5a] transition duration-200 rounded"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3 w-full">
              {/* Mobile/Tablet View */}
              <div className="lg:hidden">
                {cartItems.map((item) => {
                  const itemPrice = parseFloat(
                    String(item.price).replace("$", "")
                  );
                  const itemTotal = itemPrice * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg shadow mb-4 p-4"
                    >
                      <div className="flex items-start">
                        <div className="h-20 w-20 flex-shrink-0">
                          <img
                            className="h-20 w-20 object-cover rounded"
                            src={item.image || "/api/placeholder/80/80"}
                            alt={item.name}
                          />
                        </div>
                        <div className="ml-4 flex-grow">
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            {item.name}
                          </div>
                          <div className="flex flex-wrap gap-x-4 text-sm text-gray-500 mb-2">
                            {item.color && <div>Color: {item.color}</div>}
                            {item.size && <div>Size: {item.size}</div>}
                            <div>Price: {item.price}</div>
                          </div>

                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center border rounded">
                              <button
                                className="px-2 py-1 text-gray-600 hover:text-gray-800"
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
                                className="w-8 text-center border-0 focus:ring-0"
                              />
                              <button
                                className="px-2 py-1 text-gray-600 hover:text-gray-800"
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
                            <div className="text-sm font-medium">
                              Total: ${itemTotal.toFixed(2)}
                            </div>
                          </div>

                          <div className="mt-3 text-right">
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-600 hover:text-red-900 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop View */}
              <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
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

              <div className="mt-4 flex flex-col sm:flex-row justify-between gap-3">
                <Link
                  to="/shop/all"
                  className="text-center sm:text-left text-secondary hover:underline text-sm md:text-base"
                >
                  Continue Shopping
                </Link>
                <button
                  onClick={handleClearCart}
                  className="text-center sm:text-right text-red-600 hover:text-red-800 text-sm md:text-base"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3 w-full">
              <div className="bg-white p-4 md:p-6 rounded-lg shadow">
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
                  className="w-full bg-secondary text-white py-3 px-6 hover:bg-[#aa7b5a] transition duration-200 mb-3 disabled:bg-gray-400 disabled:cursor-not-allowed rounded"
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
