import React from "react";
import { Heart } from "lucide-react";

const Wishlist = () => {
  return (
    <div>
      <h2
        className="text-2xl font-semibold mb-8"
        style={{ color: "var(--color-title)" }}
      >
        Wishlist
      </h2>
      <div className="text-center py-12" style={{ color: "var(--color-text)" }}>
        <Heart
          size={64}
          className="mx-auto mb-6"
          style={{ color: "var(--color-icons)" }}
        />
        <h3
          className="text-xl font-medium mb-4"
          style={{ color: "var(--color-title)" }}
        >
          Your wishlist is empty
        </h3>
        <p className="mb-6 text-lg">Save items you like for later.</p>
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
    </div>
  );
};

export default Wishlist;
