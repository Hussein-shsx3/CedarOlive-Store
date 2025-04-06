import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

const Product = ({ product }) => {
  // Format price as currency
  const formatPrice = (price) => {
    return typeof price === "number" ? `$${price.toFixed(2)}` : price;
  };

  // Calculate discount percentage if both prices exist
  const discountPercentage =
    product.oldPrice && product.price
      ? Math.round(
          ((parseFloat(product.oldPrice) - parseFloat(product.price)) /
            parseFloat(product.oldPrice)) *
            100
        )
      : null;

  // Helper function to render star ratings
  const renderStars = (rating) => {
    const ratingValue = rating || 0;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            fill={index < Math.floor(ratingValue) ? "#FFD700" : "none"}
            stroke={index < Math.floor(ratingValue) ? "#FFD700" : "#D1D5DB"}
            size={14}
            className={
              index < Math.floor(ratingValue)
                ? "text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
        <span className="ml-1 text-xs text-gray-600">
          ({ratingValue.toFixed(1)})
        </span>
      </div>
    );
  };

  // Use the first image from the images array, or fall back to the image property
  const productImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : product.image;

  return (
    <Link
      to={`/product/${product._id}`}
      key={product._id || product.id}
      className="group block space-y-2 w-full transition-all duration-300 hover:shadow-md rounded-md overflow-hidden"
    >
      {/* Image container with aspect ratio */}
      <div className="relative aspect-[5/6] overflow-hidden bg-gray-100">
        {productImage ? (
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}

        {/* Discount badge */}
        {discountPercentage && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discountPercentage}%
          </div>
        )}

        {/* Category tag */}
        {product.category && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
            {product.category}
          </div>
        )}
      </div>

      {/* Product details */}
      <div className="space-y-1.5 p-3">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium line-clamp-1">{product.name}</h3>
          {/* Optional badge for new or featured products */}
          {product.isNew && (
            <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
              New
            </span>
          )}
        </div>

        <p className="text-gray-500 uppercase text-xs">{product.brand}</p>

        {/* Ratings */}
        {product.ratingsAverage && (
          <div className="flex items-center">
            {renderStars(product.ratingsAverage)}
            {product.ratingsQuantity && (
              <span className="text-xs text-gray-500 ml-1">
                ({product.ratingsQuantity})
              </span>
            )}
          </div>
        )}

        {/* Price information */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-lg font-semibold">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-gray-400 line-through text-sm">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Product;
