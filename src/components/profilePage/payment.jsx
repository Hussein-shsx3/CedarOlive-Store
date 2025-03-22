import React from "react";
import { CreditCard } from "lucide-react";

const Payment = () => {
  return (
    <div>
      <h2
        className="text-2xl font-semibold mb-8"
        style={{ color: "var(--color-title)" }}
      >
        Payment Methods
      </h2>
      <div className="text-center py-12" style={{ color: "var(--color-text)" }}>
        <CreditCard
          size={64}
          className="mx-auto mb-6"
          style={{ color: "var(--color-icons)" }}
        />
        <h3
          className="text-xl font-medium mb-4"
          style={{ color: "var(--color-title)" }}
        >
          No payment methods
        </h3>
        <p className="mb-6 text-lg">
          You haven't added any payment methods yet.
        </p>
        <button
          className="px-6 py-3 rounded-md text-base font-medium"
          style={{
            backgroundColor: "var(--color-secondary)",
            color: "white",
          }}
        >
          Add Payment Method
        </button>
      </div>
    </div>
  );
};

export default Payment;
