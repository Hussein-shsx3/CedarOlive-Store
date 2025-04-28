import React, { useCallback } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import {
  useGetMyWishlist,
  removeFromWishlist,
} from "../../api/wishlist/wishlistApi";
import Product from "../product/product";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  // Fetch wishlist data using the custom hook
  const { data, isLoading, refetch } = useGetMyWishlist();
  const navigate = useNavigate();

  // Extract the actual wishlist items from the nested structure
  const wishlistItems = data?.wishlist || [];

  console.log("Wishlist items:", wishlistItems);

  // Handle the removal of an item from the wishlist
  const handleRemoveItem = useCallback(
    async (itemId) => {
      try {
        // No need to call removeFromWishlist here as it's now handled in the Product component
        // Just refetch the data to update the UI
        refetch();
      } catch (error) {
        console.error("Error updating wishlist:", error);
      }
    },
    [refetch]
  );

  const handleBrowseProducts = () => {
    navigate("/products");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Heart className="text-red-500" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">My Wishlist</h2>
          {wishlistItems.length > 0 && (
            <span className="bg-gray-100 text-gray-700 text-sm font-medium px-2 py-1 rounded-full">
              {wishlistItems.length}{" "}
              {wishlistItems.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        <button
          onClick={handleBrowseProducts}
          className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <ShoppingBag size={16} />
          Browse More
        </button>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => {
            // Use the appropriate ID field - some items use id, others use _id
            const itemId = item._id || item.id;

            return (
              <Product
                key={itemId}
                product={{
                  _id: itemId,
                  name: item.name,
                  price: item.price,
                  images: item.images,
                  description: item.description,
                  brand: item.brand,
                  category: item.category,
                  ratingsAverage: item.ratingsAverage || 0,
                  ratingsQuantity: item.ratingsQuantity || 0,
                }}
                isInWishlist={true}
                showWishlistRemoveButton={true}
                onRemoveFromWishlist={handleRemoveItem}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg shadow-sm">
          <Heart size={64} className="mx-auto mb-6 text-gray-300" />
          <h3 className="text-xl font-medium mb-4 text-gray-800">
            Your wishlist is empty
          </h3>
          <p className="mb-6 text-lg text-gray-600 max-w-md mx-auto">
            Items added to your wishlist will be saved here for you to revisit
            later.
          </p>
          <button
            onClick={handleBrowseProducts}
            className="px-6 py-3 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <ShoppingBag size={18} />
            Browse Products
          </button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
