import React from "react";
import { Link } from "react-router-dom";

const Product = ({ product }) => {
  return (
    <Link to="" key={product.id} className="group block space-y-2 w-full">
      {/* Image container with taller aspect ratio */}
      <div className="relative aspect-[5/6] overflow-hidden rounded-sm">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Product details */}
      <div className="space-y-1 p-2">
        <h3 className="text-sm font-medium line-clamp-1">{product.name}</h3>
        <p className="text-gray-500 uppercase text-xs">{product.brand}</p>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{product.price}</span>
          {product.oldPrice && (
            <span className="text-gray-400 line-through text-sm">
              {product.oldPrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Product;
