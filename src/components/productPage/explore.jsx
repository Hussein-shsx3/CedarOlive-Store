import React from "react";
import Product from "../product/product";
import { products } from "../../data";

const Explore = ({ category }) => {
  // Filter products by category and limit the number to 4
  const filteredProducts = products
    .filter((product) => product.category === category)
    .slice(0, 4);

  return (
    <section className="container px-5 md:px-0 py-12">
      <h4 className="text-gray-500 text-sm">Explore</h4>
      <h2 className="text-2xl font-medium mb-6">See More {category}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default Explore;
