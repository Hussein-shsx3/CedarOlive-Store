import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Skeleton for product image */}
      <div className="bg-gray-200 h-64 w-full rounded-md mb-4"></div>

      {/* Skeleton for product category */}
      <div className="bg-gray-200 h-3 w-16 rounded mb-2"></div>

      {/* Skeleton for product name */}
      <div className="bg-gray-200 h-5 w-3/4 rounded mb-2"></div>

      {/* Skeleton for product price */}
      <div className="bg-gray-200 h-4 w-20 rounded"></div>
    </div>
  );
};

export default ProductSkeleton;
