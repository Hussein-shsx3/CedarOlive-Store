import React from "react";
import { Link } from "react-router-dom";
import { products } from "../../data";
import Product from "../product/product";

const Section5 = () => {
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
            to=""
            className="mt-4 md:mt-6 bg-[#f0ebe731] text-white w-full sm:w-[55%] py-4 font-medium hover:bg-[#f0ebe747] transition-all duration-200 flex justify-center items-center"
          >
            Shop Collections
          </Link>
        </div>
        {/* Right - Main Image */}
        <div className="w-full md:w-[69%] h-48 sm:h-64 md:h-full">
          <img
            src="/Images/Screenshot 2025-03-09 143420.png"
            alt="Living Room Decor"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
      {/* Bottom Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-3">
        {products.map((product) =>
          product.id > 4 && product.id < 9 ? (
            <Product key={product.id} product={product} />
          ) : (
            ""
          )
        )}
      </div>
    </section>
  );
};
export default Section5;
