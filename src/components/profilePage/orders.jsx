import React from "react";
import { Package } from "lucide-react";

const Orders = ({ user }) => {
  return (
    <div>
      <h2
        className="text-2xl font-semibold mb-8"
        style={{ color: "var(--color-title)" }}
      >
        Order History
      </h2>
      {user?.orders && user.orders.length > 0 ? (
        <div className="space-y-6">
          {/* Order list would go here */}
          <div
            className="p-6 rounded-md border"
            style={{ borderColor: "var(--color-border)" }}
          >
            <p
              className="font-medium text-lg"
              style={{ color: "var(--color-title)" }}
            >
              Order #12345
            </p>
            <p
              className="text-base mb-4"
              style={{ color: "var(--color-text)" }}
            >
              Placed on March 15, 2025
            </p>
            <div className="flex justify-between items-center">
              <span
                className="px-3 py-1 text-sm rounded-full"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-secondary)",
                }}
              >
                Delivered
              </span>
              <button
                className="text-base font-medium"
                style={{ color: "var(--color-secondary)" }}
              >
                View Details
              </button>
            </div>
          </div>
          <div
            className="p-6 rounded-md border"
            style={{ borderColor: "var(--color-border)" }}
          >
            <p
              className="font-medium text-lg"
              style={{ color: "var(--color-title)" }}
            >
              Order #12346
            </p>
            <p
              className="text-base mb-4"
              style={{ color: "var(--color-text)" }}
            >
              Placed on March 10, 2025
            </p>
            <div className="flex justify-between items-center">
              <span
                className="px-3 py-1 text-sm rounded-full"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-secondary)",
                }}
              >
                Processing
              </span>
              <button
                className="text-base font-medium"
                style={{ color: "var(--color-secondary)" }}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="text-center py-12"
          style={{ color: "var(--color-text)" }}
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
          <p className="mb-6 text-lg">You haven't placed any orders yet.</p>
          <button
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
