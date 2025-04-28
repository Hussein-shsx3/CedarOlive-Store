import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../api/wishlist/wishlistApi";
import { addToCart } from "../../redux/cartSlice";
import { toast } from "react-toastify";

const Product = ({
  product,
  isInWishlist = false,
  onRemoveFromWishlist = null,
  showWishlistRemoveButton = false,
}) => {
  const dispatch = useDispatch();
  // Get current user from Redux store
  const user = useSelector((state) => state.user.currentUser);
  const [wishlistStatus, setWishlistStatus] = useState(isInWishlist);
  const [isProcessingWishlist, setIsProcessingWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Check if product is in wishlist on component mount and when user/product changes
  useEffect(() => {
    // First check the passed prop
    if (isInWishlist) {
      setWishlistStatus(true);
      return;
    }

    // Then check from user data if available
    if (isAuthenticated && user.wishlist && user.wishlist.length > 0) {
      const productId = product._id || product.id;
      // Check if the product ID exists in the user's wishlist array
      const isProductInWishlist = user.wishlist.some((wishlistItemId) => {
        // Convert to string for comparison if needed
        const wishlistId = wishlistItemId.toString
          ? wishlistItemId.toString()
          : wishlistItemId;
        const prodId = productId.toString ? productId.toString() : productId;
        return wishlistId === prodId;
      });
      setWishlistStatus(isProductInWishlist);
    } else {
      setWishlistStatus(false);
    }
  }, [isInWishlist, product, user, isAuthenticated]);

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
    const ratingValue = parseFloat(rating) || 0;
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

  // Handle add to wishlist
  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      // Redirect to login page or show login modal
      console.log("Please login to add items to wishlist");
      return;
    }

    if (isProcessingWishlist) return;

    setIsProcessingWishlist(true);

    dispatch(addToWishlist(product._id))
      .then((result) => {
        if (!result.error) {
          setWishlistStatus(true);
        }
      })
      .catch((error) => {
        console.error("Failed to add to wishlist:", error);
      })
      .finally(() => {
        setIsProcessingWishlist(false);
      });
  };

  // Handle remove from wishlist
  const handleRemoveFromWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) return;
    if (isProcessingWishlist) return;

    setIsProcessingWishlist(true);

    // Get the correct ID (some items use id, others use _id)
    const itemId = product._id || product.id;

    dispatch(removeFromWishlist(itemId))
      .then((result) => {
        if (!result.error) {
          setWishlistStatus(false);
          // If parent component provided a callback for removal
          if (onRemoveFromWishlist) {
            onRemoveFromWishlist(itemId);
          }
        }
      })
      .catch((error) => {
        console.error("Failed to remove from wishlist:", error);
      })
      .finally(() => {
        setIsProcessingWishlist(false);
      });
  };

  // Handle add to cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAddingToCart) return;

    setIsAddingToCart(true);

    try {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image || product.images[0],
          quantity: 1,
        })
      );
      toast.success(`${product.name} added to cart successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => setIsAddingToCart(false), 500);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setIsAddingToCart(false);
    }
  };

  // Use the first image from the images array, or fallback appropriately
  const productImage =
    product.images && product.images.length > 0
      ? typeof product.images[0] === "string"
        ? product.images[0]
        : product.images[0]?.url
      : product.image;

  return (
    <div className="w-full overflow-hidden group transition-all duration-300">
      <div className="relative">
        <Link to={`/product/${product._id || product.id}`} className="block">
          {/* Image container with aspect ratio */}
          <div className="relative aspect-[5/6] overflow-hidden bg-gray-100">
            {productImage ? (
              <img
                src={productImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
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

            {/* Category tag */}
            {product.category && (
              <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white text-xs font-medium px-2 py-1 rounded-md">
                {product.category}
              </div>
            )}
          </div>
        </Link>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 transition-opacity duration-300">
          {isAuthenticated ? (
            showWishlistRemoveButton ? (
              <button
                className="p-2 rounded-full shadow-md bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                onClick={handleRemoveFromWishlist}
                disabled={isProcessingWishlist}
                type="button"
                aria-label="Remove from wishlist"
              >
                <Trash2 size={18} />
              </button>
            ) : (
              <button
                className={`p-2 rounded-full shadow-md transition-colors ${
                  wishlistStatus
                    ? "bg-red-50 text-red-500 hover:bg-red-100"
                    : "bg-white text-gray-700 hover:text-red-500 hover:bg-red-50"
                }`}
                onClick={
                  wishlistStatus
                    ? handleRemoveFromWishlist
                    : handleAddToWishlist
                }
                disabled={isProcessingWishlist}
                type="button"
                aria-label={
                  wishlistStatus ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                {isProcessingWishlist ? (
                  <span className="animate-pulse">
                    <Heart
                      size={18}
                      fill={wishlistStatus ? "currentColor" : "none"}
                    />
                  </span>
                ) : (
                  <Heart
                    size={18}
                    fill={wishlistStatus ? "currentColor" : "none"}
                  />
                )}
              </button>
            )
          ) : null}

          <button
            className={`p-2 rounded-full shadow-md ${
              isAddingToCart
                ? "bg-blue-50 text-blue-600"
                : "bg-white text-gray-700 hover:text-blue-600 hover:bg-blue-50"
            } transition-colors`}
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            type="button"
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>

      {/* Product details */}
      <div className="py-4 space-y-2">
        <Link
          to={`/product/${product._id || product.id}`}
          className="block group"
        >
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold line-clamp-1 text-gray-800 group-hover:text-black transition-colors">
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
          <div className="flex items-center mt-[5px]">
            {renderStars(product.ratingsAverage)}
            {product.ratingsQuantity > 0 && (
              <span className="text-xs text-gray-500 ml-1">
                ({product.ratingsQuantity})
              </span>
            )}
          </div>

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
        </Link>
      </div>
    </div>
  );
};

export default Product;
