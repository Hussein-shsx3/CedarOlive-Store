import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const SearchOverlay = ({
  isOpen,
  onClose,
  products = [],
  isLoading,
  onSearchChange,
  searchTerm,
}) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const searchInputRef = useRef(null);

  // When the overlay opens, focus the search input and use the existing searchTerm
  useEffect(() => {
    if (isOpen) {
      setLocalSearchTerm(searchTerm);
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, searchTerm]);

  // Filter products locally when localSearchTerm changes
  useEffect(() => {
    if (localSearchTerm.trim() === "") {
      setFilteredProducts([]);
      return;
    }

    const searchTermLower = localSearchTerm.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTermLower) ||
        (product.description &&
          product.description.toLowerCase().includes(searchTermLower)) ||
        (product.category &&
          product.category.toLowerCase().includes(searchTermLower))
    );

    setFilteredProducts(filtered);
  }, [localSearchTerm, products]);

  // Handle local search input change
  const handleInputChange = (e) => {
    const newTerm = e.target.value;
    setLocalSearchTerm(newTerm);

    // We update the parent component's searchTerm when the user stops typing
    // This prevents too many API requests as the user types
    const debounceTimeout = setTimeout(() => {
      onSearchChange(newTerm);
    }, 500); // 500ms debounce

    return () => clearTimeout(debounceTimeout);
  };

  // Handle key press events (e.g., closing overlay on Escape)
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  // Helper function to get the appropriate image URL
  const getProductImageUrl = (product) => {
    // Check if product has images array and it's not empty
    if (product.images && product.images.length > 0) {
      return product.images[0]; // Use the first image
    }
    // Fallback to direct image property if it exists
    else if (product.image) {
      return product.image;
    }
    // Return a placeholder if no images are available
    else {
      return "https://placehold.co/300x300?text=No+Image";
    }
  };

  return (
    <>
      {/* Dark overlay background */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 z-50 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      {/* Search popup */}
      <div
        className={`fixed top-0 left-0 w-full bg-white z-50 shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-medium">Search Products</h2>
            <button
              className="text-gray-500 hover:text-black transition duration-200"
              onClick={onClose}
              aria-label="Close search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="relative mb-4">
            <input
              ref={searchInputRef}
              type="text"
              value={localSearchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search for products..."
              className="w-full py-2 px-3 border border-gray-300 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition duration-200 rounded-md"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="search-results max-h-72 overflow-y-auto">
            {isLoading ? (
              <div className="py-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto"></div>
                <p className="mt-1 text-sm text-gray-600">
                  Loading products...
                </p>
              </div>
            ) : localSearchTerm.trim() === "" ? (
              <div className="py-4 text-center text-sm text-gray-500">
                Enter a search term to find products
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-4 text-center text-sm text-gray-500">
                No products found matching "{localSearchTerm}"
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {filteredProducts.map((product) => (
                  <Link
                    key={product._id || product.id}
                    to={`/product/${product._id || product.id}`}
                    className="group"
                    onClick={onClose}
                  >
                    <div className="bg-gray-100 aspect-square overflow-hidden relative rounded">
                      <img
                        src={getProductImageUrl(product)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.discount > 0 && (
                        <span className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded text-xs">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-sm">
                      <h3 className="font-medium text-title truncate group-hover:text-secondary transition-colors duration-200">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {product.category || "Uncategorized"}
                      </p>
                      <div className="flex items-center mt-0.5">
                        <span className="font-medium text-sm">
                          ${parseFloat(product.price).toFixed(2)}
                        </span>
                        {product.oldPrice && (
                          <span className="ml-1 text-gray-500 line-through text-xs">
                            ${parseFloat(product.oldPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {filteredProducts.length > 0 && (
            <div className="mt-3 text-center">
              <Link
                to={`/shop/All?search=${encodeURIComponent(localSearchTerm)}`}
                className="inline-block px-4 py-1.5 text-sm bg-secondary text-white rounded hover:bg-[#9a4a25] transition-colors duration-300"
                onClick={onClose}
              >
                View All Results
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchOverlay;
