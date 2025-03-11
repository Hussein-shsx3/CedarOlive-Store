import React from "react";
import Product from "../product/product";
import { products } from "../../data";

const Section4 = () => {
  return (
    <section className="container px-5 md:px-0 py-12">
      <h4 className="text-gray-500 text-sm">Spring Season</h4>
      <h2 className="text-2xl font-medium mb-6">New Arrivals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) =>
          product.id < 5 ? <Product product={product} /> : ""
        )}
      </div>
    </section>
  );
};

export default Section4;
