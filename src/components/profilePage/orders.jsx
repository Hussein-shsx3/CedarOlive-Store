import React from "react";
import { Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "../../api/order/orderApi";
import { format } from "date-fns";

const Orders = () => {
  const navigate = useNavigate();

  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["myOrders"],
    queryFn: getMyOrders,
  });

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "deleviered": // Handle potential typo in your model enum
        return {
          bg: "var(--color-success, #4CAF50)",
          text: "white",
        };
      case "placed":
        return {
          bg: "var(--color-info, #2196F3)",
          text: "white",
        };
      case "packed":
        return {
          bg: "var(--color-primary, #9C27B0)",
          text: "white",
        };
      case "shipped":
        return {
          bg: "var(--color-warning, #FF9800)",
          text: "white",
        };
      case "canceled":
        return {
          bg: "var(--color-error, #F44336)",
          text: "white",
        };
      default:
        return {
          bg: "var(--color-primary)",
          text: "var(--color-secondary)",
        };
    }
  };

  const handleBrowseProducts = () => {
    navigate("/products");
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center" style={{ color: "var(--color-text)" }}>
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-8 mx-auto"></div>
          <div className="h-32 w-full max-w-lg bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="py-12 text-center"
        style={{ color: "var(--color-error, red)" }}
      >
        <h2 className="text-2xl font-semibold mb-4">Error Loading Orders</h2>
        <p>
          {error?.message ||
            "Unable to load your orders. Please try again later."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 rounded-md text-base font-medium"
          style={{
            backgroundColor: "var(--color-secondary)",
            color: "white",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <h2
        className="text-2xl font-semibold mb-8"
        style={{ color: "var(--color-title)" }}
      >
        Order History
      </h2>
      {orders && orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="p-4 md:p-6 rounded-md border transition-all hover:shadow-md"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <div>
                  <p
                    className="font-medium text-lg"
                    style={{ color: "var(--color-title)" }}
                  >
                    Order #{order._id?.substring(0, 8) || "N/A"}
                  </p>
                  <p
                    className="text-sm md:text-base"
                    style={{ color: "var(--color-text)" }}
                  >
                    Placed on {formatDate(order.createdAt)}
                  </p>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "var(--color-text-light)" }}
                  >
                    Payment: {order.paymentMethod}
                    {order.isPaid ? " (Paid)" : " (Unpaid)"}
                  </p>
                </div>
                <div className="mt-2 md:mt-0 text-right">
                  <p
                    className="text-base font-medium"
                    style={{ color: "var(--color-title)" }}
                  >
                    Total: ${order.totalPrice?.toFixed(2) || "0.00"}
                  </p>
                  <div className="flex justify-end mt-1">
                    <span
                      className="px-3 py-1 text-sm rounded-full"
                      style={{
                        backgroundColor: getStatusColor(order.orderStatus).bg,
                        color: getStatusColor(order.orderStatus).text,
                      }}
                    >
                      {order.orderStatus || "Placed"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div
                className="mt-3 text-sm"
                style={{ color: "var(--color-text)" }}
              >
                <p>
                  <span className="font-medium">Shipping: </span>
                  {order.shippingAddress?.address},{" "}
                  {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.country}
                  {order.shippingAddress?.postalCode &&
                    ` - ${order.shippingAddress.postalCode}`}
                </p>
                {order.isDelivered && order.deliveredAt && (
                  <p
                    className="mt-1"
                    style={{ color: "var(--color-success, green)" }}
                  >
                    Delivered on {formatDate(order.deliveredAt)}
                  </p>
                )}
              </div>

              {/* Order Items */}
              <div
                className="mt-4 pt-4 border-t"
                style={{ borderColor: "var(--color-border-light, #eee)" }}
              >
                <p
                  className="text-sm mb-2"
                  style={{ color: "var(--color-text-light)" }}
                >
                  {order.orderItems?.length || 0}{" "}
                  {order.orderItems?.length === 1 ? "item" : "items"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {order.orderItems?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center p-2 rounded-md border"
                      style={{ borderColor: "var(--color-border-light)" }}
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-16 h-16 mr-3 rounded-md overflow-hidden bg-gray-100">
                        {item.product &&
                        item.product.images &&
                        item.product.images.length > 0 ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/placeholder-product.png"; // Fallback image
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-gray-200">
                            <Package
                              size={24}
                              style={{ color: "var(--color-icons)" }}
                            />
                          </div>
                        )}
                      </div>
                      {/* Product Details */}
                      <div className="flex-grow">
                        <p
                          className="font-medium text-sm"
                          style={{ color: "var(--color-title)" }}
                        >
                          {item.name || `Product #${idx + 1}`}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--color-text-light)" }}
                        >
                          {item.quantity}x ${item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="text-center py-12 max-w-lg mx-auto border rounded-lg"
          style={{
            color: "var(--color-text)",
            borderColor: "var(--color-border)",
          }}
        >
          <Package
            size={64}
            className="mx-auto mb-6"
            style={{ color: "var(--color-icons)" }}
          />
          <h3
            className="text-xl font-medium mb-4"
            style={{ color: "var(--color-title)" }}
          >
            No orders yet
          </h3>
          <p className="mb-6 text-lg px-4">
            You haven't placed any orders yet.
          </p>
          <button
            onClick={handleBrowseProducts}
            className="px-6 py-3 rounded-md text-base font-medium"
            style={{
              backgroundColor: "var(--color-secondary)",
              color: "white",
            }}
          >
            Browse Products
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;
