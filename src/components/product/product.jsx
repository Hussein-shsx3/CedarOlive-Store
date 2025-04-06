import React from "react";
import { Link } from "react-router-dom";
import { Star, Heart, ShoppingCart } from "lucide-react";

const Product = ({ product }) => {
  const formatPrice = (price) => {
    return typeof price === "number" ? `$${price.toFixed(2)}` : price;
  };

  const discountPercentage =
    product.oldPrice && product.price
      ? Math.round(
          ((parseFloat(product.oldPrice) - parseFloat(product.price)) /
            parseFloat(product.oldPrice)) *
            100
        )
      : null;

  const renderStars = (rating) => {
    const ratingValue = rating || 0;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            fill={index < Math.floor(ratingValue) ? "#FFD700" : "none"}
            stroke={index < Math.floor(ratingValue) ? "#FFD700" : "#D1D5DB"}
            size={16}
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
    <div className="w-full overflow-hidden">
      <Link to={`/product/${product._id}`} className="block">
        {/* Image container with aspect ratio */}
        <div className="relative aspect-[5/6] overflow-hidden bg-gray-50">
          {productImage ? (
            <img
              src={productImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}

          {/* Discount badge */}
          {discountPercentage && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discountPercentage}%
            </div>
          )}

          {/* Quick action buttons - visible on hover */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="bg-white p-2 rounded-full shadow-md text-gray-700 hover:text-red-500 transition-colors">
              <Heart size={18} />
            </button>
            <button className="bg-white p-2 rounded-full shadow-md text-gray-700 hover:text-blue-500 transition-colors">
              <ShoppingCart size={18} />
            </button>
          </div>

          {/* Category tag */}
          {product.category && (
            <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white text-xs font-medium px-2 py-1 rounded-md">
              {product.category}
            </div>
          )}
        </div>
      </Link>

      {/* Product details */}
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium line-clamp-1 text-gray-800">
            {product.name}
          </h3>
          {product.isNew && (
            <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-md font-medium">
              New
            </span>
          )}
        </div>

        <p className="text-gray-500 uppercase text-xs font-medium">
          {product.brand}
        </p>

        {/* Ratings */}
        {product.ratingsAverage && (
          <div className="flex items-center">
            {renderStars(product.ratingsAverage)}
            {product.ratingsQuantity > 0 && (
              <span className="text-xs text-gray-500 ml-1">
                ({product.ratingsQuantity})
              </span>
            )}
          </div>
        )}

        {/* Price information */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-lg font-semibold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-gray-400 line-through text-sm">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
