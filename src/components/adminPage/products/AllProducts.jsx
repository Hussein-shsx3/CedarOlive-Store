import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetAllProducts,
  deleteProductById,
} from "../../../api/products/productsApi";
import { useDispatch } from "react-redux";
import { Trash2, Eye, Star } from "lucide-react";

const AllProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const productsPerPage = 12;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Debounce search term to reduce rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const queryParams = {
    limit: 100,
  };

  const { data, isLoading, error, refetch } = useGetAllProducts(queryParams);

  // Use useMemo to memoize the allProducts array
  const allProducts = useMemo(() => data?.products || [], [data?.products]);

  const filteredProducts = useMemo(() => {
    if (!debouncedSearchTerm) return allProducts;

    const searchLower = debouncedSearchTerm.toLowerCase();
    return allProducts.filter((product) => {
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    });
  }, [debouncedSearchTerm, allProducts]);

  // Calculate pagination
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // Get current page of products
  const currentProducts = useMemo(() => {
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    return filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  }, [filteredProducts, currentPage, productsPerPage]);

  // Index calculations for display
  const indexOfFirstProduct = (currentPage - 1) * productsPerPage;
  const indexOfLastProduct = Math.min(
    indexOfFirstProduct + productsPerPage,
    totalProducts
  );

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // Prepare for delete
  const prepareDelete = (product, e) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setShowConfirmation(true);
  };

  // Handle delete confirmation
  const handleDelete = async () => {
    if (selectedProduct) {
      try {
        setIsDeleting(true);
        await dispatch(deleteProductById(selectedProduct._id));
        // Refetch products after successful deletion
        await refetch();

        // If we're on a page that would now be empty, go back one page
        if (currentProducts.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      } finally {
        setIsDeleting(false);
        setShowConfirmation(false);
        setSelectedProduct(null);
      }
    }
  };

  // Handle view product
  const handleViewProduct = (productId) => {
    navigate(`/admin/product/${productId}`);
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowConfirmation(false);
    setSelectedProduct(null);
  };

  // Render star ratings
  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            fill={index < Math.floor(rating) ? "#FFD700" : "none"}
            stroke={index < Math.floor(rating) ? "#FFD700" : "#D1D5DB"}
            size={16}
            className={
              index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
            }
          />
        ))}
        <span className="ml-1 text-sm text-gray-700">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A0522D]"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-100 p-4 rounded-md">
        <p className="text-red-700">Error loading products: {error.message}</p>
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-[#A0522D]">All Products</h2>
      <p className="text-gray-600 mb-6">Manage your product inventory</p>

      {/* Search input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products by name, brand or category..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A0522D] focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Products table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Image</th>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Brand</th>
              <th className="border p-2 text-left">Category</th>
              <th className="border p-2 text-left">Price</th>
              <th className="border p-2 text-left">Rating</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="border p-4 text-center text-gray-500"
                >
                  No products found
                </td>
              </tr>
            ) : (
              currentProducts.map((product) => (
                <tr
                  key={product._id}
                  className="border hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleViewProduct(product._id)}
                >
                  <td className="border p-2">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-16 w-16 object-cover rounded"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gray-200 flex items-center justify-center rounded">
                        <span className="text-gray-500 text-xs">No image</span>
                      </div>
                    )}
                  </td>
                  <td className="border p-2">
                    <div className="font-medium">{product.name}</div>
                  </td>
                  <td className="border p-2">{product.brand}</td>
                  <td className="border p-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {product.category}
                    </span>
                  </td>
                  <td className="border p-2">${product.price}</td>
                  <td className="border p-2">
                    {renderStars(product.ratingsAverage)}
                    <div className="text-xs text-gray-500">
                      {product.ratingsQuantity} reviews
                    </div>
                  </td>
                  <td
                    className="border p-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex gap-2">
                      <button
                        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                        onClick={() => handleViewProduct(product._id)}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                        onClick={(e) => prepareDelete(product, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstProduct + 1} to {indexOfLastProduct} of{" "}
            {totalProducts} products
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Previous
            </button>

            {/* Show limited page numbers for better UX when many pages */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Calculate which page numbers to show
              let startPage;
              if (currentPage <= 3) {
                startPage = 1;
              } else if (currentPage >= totalPages - 2) {
                startPage = Math.max(1, totalPages - 4);
              } else {
                startPage = currentPage - 2;
              }

              const pageNumber = startPage + i;

              // Only show if page number is valid
              if (pageNumber <= 0 || pageNumber > totalPages) {
                return null;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-3 py-1 rounded ${
                    currentPage === pageNumber
                      ? "bg-[#A0522D] text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-red-600 mb-2">
              Confirm Deletion
            </h3>
            {selectedProduct && (
              <div className="flex items-center gap-4 mb-4">
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  <img
                    src={selectedProduct.images[0]}
                    alt={selectedProduct.name}
                    className="h-16 w-16 object-cover rounded"
                  />
                ) : (
                  <div className="h-16 w-16 bg-gray-200 flex items-center justify-center rounded">
                    <span className="text-gray-500 text-xs">No image</span>
                  </div>
                )}
                <div>
                  <p className="font-medium">{selectedProduct.name}</p>
                  <p className="text-sm text-gray-500">
                    {selectedProduct.brand} · {selectedProduct.category}
                  </p>
                </div>
              </div>
            )}
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition duration-200"
                onClick={cancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200 flex items-center"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
