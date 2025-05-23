import React from "react";
import Product from "../product/product";
import ProductSkeleton from "../loading/ProductSkeleton";
import { useGetAllProducts } from "../../api/products/productsApi";

const Section4 = () => {
  // Adding query parameters to limit to only 4 products
  const queryParams = {
    limit: 4,
  };

  const { data, isLoading, error } = useGetAllProducts(queryParams);

  // Extract just the products array from the data
  const products = data?.products || [];

  return (
    <section className="container px-5 md:px-0 py-12">
      <h4 className="text-gray-500 text-sm">Spring Season</h4>
      <h2 className="text-2xl font-medium mb-6">New Arrivals</h2>

      {error && (
        <div className="text-red-500 p-4 rounded-md bg-red-50 mb-6">
          Failed to load products. Please try again later.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {isLoading ? (
          // Display skeleton loaders while loading
          Array(4)
            .fill(0)
            .map((_, index) => <ProductSkeleton key={`skeleton-${index}`} />)
        ) : products.length > 0 ? (
          // Display the products - no need to slice since we're already limiting to 4
          products.map((product) => (
            <Product key={product._id} product={product} />
          ))
        ) : (
          // Handle empty state
          <div className="col-span-full text-center py-10 text-gray-500">
            No products available at the moment.
          </div>
        )}
      </div>
    </section>
  );
};

export default Section4;
