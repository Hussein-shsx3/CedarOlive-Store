import React, { useState } from "react";
import { Edit, Trash2, X, AlertCircle } from "lucide-react";
import { products } from "../../../data";

// Custom Delete Confirmation Dialog
const ProductDeleteAlert = ({ onConfirm, productName, productId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <>
      <button
        onClick={handleClickOpen}
        className="bg-red-100 text-red-600 px-3 py-2 rounded-md hover:bg-red-200 transition-colors duration-200 flex items-center"
      >
        <Trash2 className="w-4 h-4 mr-2" /> Delete
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full animate-scaleIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#A0522D] flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                Confirm Deletion
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the product{" "}
              <span className="font-semibold text-[#A0522D]">
                {productName}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ProductCard = ({ product, onDelete, onEdit }) => {
  const [imageError, setImageError] = useState(false);

  // Calculate discount percentage if oldPrice exists
  const discountPercentage = product.oldPrice
    ? Math.round(
        ((parseFloat(product.oldPrice.replace(/[^0-9.]/g, "")) -
          parseFloat(product.price.replace(/[^0-9.]/g, ""))) /
          parseFloat(product.oldPrice.replace(/[^0-9.]/g, ""))) *
          100
      )
    : null;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col h-full border border-gray-100">
      <div className="relative">
        {/* Image container with fixed height */}
        <div className="h-48 overflow-hidden bg-gray-100">
          {!imageError ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        {/* Badge for stock status or featured product */}
        {product.stock === "low" && (
          <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
            Low Stock
          </span>
        )}
        {product.featured && (
          <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            Featured
          </span>
        )}
        {discountPercentage && (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            -{discountPercentage}%
          </span>
        )}
      </div>

      <div className="p-4 flex-grow">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">
          {product.name}
        </h3>
        <div className="text-sm text-gray-600 mb-3">
          {product.brand && (
            <p className="mb-1">
              Brand: <span className="font-medium">{product.brand}</span>
            </p>
          )}
          {product.category && (
            <p>
              Category: <span className="font-medium">{product.category}</span>
            </p>
          )}
        </div>

        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold text-[#A0522D]">
              {product.price}
            </span>
            {product.oldPrice && (
              <span className="line-through text-gray-400 text-sm">
                {product.oldPrice}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between p-4 border-t border-gray-100 bg-gray-50">
        <button
          onClick={() => onEdit(product)}
          className="bg-blue-100 text-blue-600 px-3 py-2 rounded-md hover:bg-blue-200 transition-colors duration-200 flex items-center"
        >
          <Edit className="w-4 h-4 mr-2" /> Edit
        </button>

        <ProductDeleteAlert
          productId={product.id}
          productName={product.name}
          onConfirm={() => onDelete(product.id)}
        />
      </div>
    </div>
  );
};

const ProductList = () => {
  const [productList, setProductList] = useState(products);

  const handleDelete = (productId) => {
    setProductList(productList.filter((product) => product.id !== productId));
  };

  const handleEdit = (product) => {
    // Implement edit logic or navigate to edit page
    console.log("Edit product:", product);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {productList.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
      {productList.length === 0 && (
        <div className="col-span-3 py-12 text-center text-gray-500">
          No products found
        </div>
      )}
    </div>
  );
};

export default ProductList;
