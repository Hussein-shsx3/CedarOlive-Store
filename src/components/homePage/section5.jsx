import React from "react";
import { Link } from "react-router-dom";
import Product from "../product/product";
import ProductSkeleton from "../loading/ProductSkeleton";
import { useGetAllProducts } from "../../api/products/productsApi";

const Section5 = () => {
  const { data, isLoading, error } = useGetAllProducts({
    brand: "PALESTINIAN",
    limit: 4,
  });

  const products = data?.products || [];

  return (
    <section className="container w-full my-16 px-5 md:px-0">
      {/* Top Section - Improved Responsiveness */}
      <div className="flex flex-col md:flex-row bg-secondary justify-center items-stretch overflow-hidden h-auto min-h-[400px] md:h-[670px]">
        {/* Left - Text Block */}
        <div className="w-full md:w-[32%] text-white p-6 sm:p-8 md:p-10 flex flex-col justify-start space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-medium leading-snug">
            Make your living room your favorite with the right decor
          </h2>
          <p className="mt-2 md:mt-4 text-sm md:text-base leading-relaxed">
            Aliquam erat volutpat excepteur sint occaecat cupidatat proident.
          </p>
          <Link
            to="/collections"
            className="mt-4 md:mt-6 bg-[#f0ebe731] text-white w-full sm:w-[55%] py-4 font-medium hover:bg-[#f0ebe747] transition-all duration-200 flex justify-center items-center"
          >
            Shop Collections
          </Link>
        </div>
        {/* Right - Main Image */}
        <div className="w-full md:w-[69%] h-48 sm:h-64 md:h-full">
          <img
            src="/Images/63f5cf9cef5fdf054c8af861_collections banner.jpg"
            alt="Living Room Decor"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      {/* Bottom Product Grid with Loading States */}
      {error && (
        <div className="text-red-500 p-4 rounded-md bg-red-50 mt-6">
          Failed to load products. Please try again later.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
        {isLoading ? (
          // Display skeleton loaders while loading
          Array(4)
            .fill(0)
            .map((_, index) => <ProductSkeleton key={`skeleton-${index}`} />)
        ) : products?.length > 0 ? (
          // Display only the last 4 products
          products
            .slice(-4)
            .map((product) => <Product key={product.id} product={product} />)
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

export default Section5;
