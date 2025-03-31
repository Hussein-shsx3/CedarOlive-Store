import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";

const SearchOverlay = ({ isOpen, onClose, products }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!isOpen) {
      setSearchQuery("");
      setFilteredProducts([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts([]);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = products
      .filter((product) => {
        return (
          product.name.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query)
        );
      })
      .slice(0, 5);

    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onClose();
      navigate(`/shop/${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleProductClick = () => {
    onClose();
    setSearchQuery("");
  };

  return (
    <div
      className={`w-full bg-white shadow-md transition-all duration-300 ease-in-out absolute top-16 left-0 right-0 overflow-hidden z-50 ${
        isOpen ? "max-h-[400px]" : "max-h-0"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <form onSubmit={handleSearch} className="flex items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for products..."
              className="flex-grow p-2 pl-10 border border-gray-300 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary rounded-md w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-secondary text-white px-6 py-2 ml-2 hover:bg-[#aa7b5a] transition duration-200 rounded-md"
          >
            Search
          </button>
          <button
            type="button"
            className="ml-2 p-2 text-gray-500 hover:text-black"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </form>

        {filteredProducts.length > 0 && (
          <div className="mt-4 border-t pt-3">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Products</h3>
            <div className="overflow-y-scroll max-h-60 space-y-3">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="flex items-center p-2 hover:bg-gray-50 rounded-md transition duration-200"
                  onClick={handleProductClick}
                >
                  <div className="w-12 h-12 flex-shrink-0 mr-4 bg-gray-100 rounded overflow-hidden">
                    <img
                      src={product.image || "/api/placeholder/48/48"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-sm">{product.name}</h4>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-gray-500 text-xs">
                        {product.category}
                      </p>
                      <p className="text-secondary font-medium text-sm">
                        {product.price}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {/* View all results link */}
            {searchQuery.trim() !== "" && (
              <div className="mt-3 text-center">
                <Link
                  to={`/shop/All`}
                  className="text-secondary hover:underline text-sm font-medium"
                  onClick={onClose}
                >
                  View all results for "{searchQuery}"
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
