import React from "react";
import Product from "../product/product";
import ProductSkeleton from "../loading/ProductSkeleton";
import { useGetAllProducts } from "../../api/products/productsApi";

const Explore = ({ category }) => {
  const queryParams = {
    limit: 8, // Reduced limit to a reasonable number for "See More" section
    page: 1,
    sort: "-createdAt", // Sort newest first (default behavior)
    category, // Filter by category
    fields: "id,name,price,ratingsAverage,images,category", // Only get necessary fields
  };

  const { data, isLoading, error } = useGetAllProducts(queryParams);

  // Create skeleton array for loading state
  const skeletonArray = Array(4).fill(0);

  // Render appropriate content based on API state
  const renderContent = () => {
    if (isLoading) {
      return skeletonArray.map((_, index) => (
        <ProductSkeleton key={`skeleton-${index}`} />
      ));
    }

    if (error) {
      return (
        <div className="col-span-full text-center py-8">
          <p className="text-red-500">
            Failed to load products. Please try again later.
          </p>
        </div>
      );
    }

    // Check if data exists and has products property
    if (!data || !data.products || data.products.length === 0) {
      return (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-500">No products found in this category.</p>
        </div>
      );
    }

    // Access the products array from the API response
    return data.products.map((product) => (
      <Product key={product.id} product={product} />
    ));
  };

  return (
    <section className="container px-5 md:px-0 py-12">
      <h4 className="text-gray-500 text-sm">Explore</h4>
      <h2 className="text-2xl font-medium mb-6">
        See More {category || "Products"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {renderContent()}
      </div>
    </section>
  );
};

export default Explore;
